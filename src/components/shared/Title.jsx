import React from "react";
import { Helmet } from "react-helmet-async";

const Title = ({
  title = "Yapping!",
  description = "Yapping! - Connect and chat with friends in real-time. Experience modern messaging with seamless communication, friend requests, and group chats.",
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
};

export default Title;