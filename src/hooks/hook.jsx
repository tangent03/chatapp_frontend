import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useErrors = (errors = []) => {
  useEffect(() => {
    errors.forEach(({ isError, error, fallback }) => {
      if (isError) {
        if (fallback) fallback();
        else toast.error(error?.data?.message || "Something went wrong");
      }
    });
  }, [errors]);
};

const useAsyncMutation = (mutatationHook) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const [mutate] = mutatationHook();

  const executeMutation = async (toastMessage, ...args) => {
    setIsLoading(true);
    const toastId = toast.loading(toastMessage || "Updating data...");

    try {
      const res = await mutate(...args);

      if (res.data) {
        toast.success(res.data.message || "Updated data successfully", {
          id: toastId,
        });
        setData(res.data);
      } else {
        toast.error(res?.error?.data?.message || "Something went wrong", {
          id: toastId,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return [executeMutation, isLoading, data];
};

/**
 * Custom hook to handle socket events more reliably
 * @param {Socket} socket - Socket.io client instance
 * @param {Object} eventHandlers - Object mapping event names to handler functions
 */
export const useSocketEvents = (socket, eventHandlers) => {
  useEffect(() => {
    if (!socket || !eventHandlers) return;

    // Clean up any existing event listeners first
    const events = Object.keys(eventHandlers);
    events.forEach((event) => {
      socket.off(event);
    });

    // Register all new event handlers
    events.forEach((event) => {
      if (typeof eventHandlers[event] === 'function') {
        console.log(`Registering event handler for ${event}`);
        socket.on(event, eventHandlers[event]);
      } else {
        console.error(`Invalid handler for event ${event}`, eventHandlers[event]);
      }
    });

    // Handle reconnection - reattach event listeners when socket reconnects
    const handleReconnect = () => {
      console.log("Socket reconnected, reattaching event handlers");
      events.forEach((event) => {
        if (typeof eventHandlers[event] === 'function') {
          // First remove any duplicate handlers
          socket.off(event);
          // Then reattach the handler
          socket.on(event, eventHandlers[event]);
        }
      });
    };

    socket.on('reconnect', handleReconnect);

    // Cleanup on unmount
    return () => {
      events.forEach((event) => {
        socket.off(event);
      });
      socket.off('reconnect', handleReconnect);
    };
  }, [socket, eventHandlers]);
};

// Custom useFetchData hook to replace the 6pp library for admin pages
const useFetchData = (url, cacheKey = "") => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, { withCredentials: true });
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
        if (err.response?.status === 401) {
          toast.error("Authentication error. Please log in again.");
        } else {
          toast.error(err.response?.data?.message || "Failed to fetch data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, cacheKey]);

  return { loading, data, error };
};

export { useAsyncMutation, useErrors, useFetchData };

