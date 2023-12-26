import React, { useEffect, useState } from "react";
import ReactHowler from "react-howler";
import { Howl } from "howler";

const Sound = ({ stateWarning, soundUrl }) => {
  useEffect(() => {
    // Khởi tạo âm thanh khi component được mount
    if (stateWarning) {
      const sound = new Howl({
        src: soundUrl, // Đường dẫn đến file âm thanh của bạn
        autoplay: true,
        loop: true, // Phát lại âm thanh liên tục
      });
      return () => {
        sound.stop();
      };
    }

    // Xóa âm thanh khi component bị unmount
  }, [stateWarning]);
  return (
    <div className="main-container">
      {/* {stateWarning && <ReactHowler src={soundUrl} playing={true} />} */}
    </div>
  );
};

export default Sound;
