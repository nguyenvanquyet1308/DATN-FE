import axios from "config/axios";

export const postChatbox = (data) => {
  return axios({
    url: `/gemini/chat`,
    method: "post",
    data,
  });
};
