import bus from "../utils/bus";

interface propsFlashMessage {
  msg: string;
  type: string;
}

export default function useFlashMessage() {
  function setFlashMessage({msg, type}: propsFlashMessage) {
    bus.emit("flash", {
      message: msg,
      type: type,
    });
  }

  return { setFlashMessage };
}
