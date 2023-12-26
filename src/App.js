import "./App.css";
import Lottie from "lottie-react";
import Warning from "./media/warning.json";
import Home from "./media/home.json";
import { useEffect, useRef, useState } from "react";
import Sound from "./component/Sound";
import amthanh1 from "./media/canhbaochayno.mp3";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DatePicker, Space, Switch } from "antd";
import io from "socket.io-client";
import addNotification from "react-push-notification";

const socket = io.connect("http://localhost:3001");
dayjs.extend(customParseFormat);
const range = (start, end) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

const disabledDate = (current) => {
  return current && current < dayjs().endOf("day");
};
const disabledDateTime = () => ({
  disabledHours: () => range(0, 24).splice(4, 20),
  disabledMinutes: () => range(30, 60),
  disabledSeconds: () => [55, 56],
});

function App() {
  const [stateBellWaring, setStateBellWaring] = useState(false);
  const [stateWaring, setStateWaring] = useState(false);
  const [stateSystem, setStateSystem] = useState(false);
  const [stateTimerOn, setStateTimerOn] = useState(false);
  const [statusDateStart, setStatusDateStart] = useState("");
  const [statusTimeStart, setStatusTimeStart] = useState("");
  const [stateTimerOff, setStateTimerOff] = useState(false);
  const [statusDateEnd, setStatusDateEnd] = useState("");
  const [statusTimeEnd, setStatusTimeEnd] = useState("");

  useEffect(() => {
    const getTimeDate = JSON.parse(localStorage.getItem("date"));
    const getTimeDateEnd = JSON.parse(localStorage.getItem("dateend"));
    const parsedDate = dayjs(getTimeDate);
    const formatDateString = parsedDate.format("DD-MM-YYYY");
    const formatTimeString = parsedDate.format("HH:mm");
    setStatusDateStart(formatDateString);
    setStatusTimeStart(formatTimeString);
    const parsedDateEnd = dayjs(getTimeDateEnd);
    const formatDateStringEnd = parsedDateEnd.format("DD-MM-YYYY");
    const formatTimeStringEnd = parsedDateEnd.format("HH:mm");
    setStatusDateEnd(formatDateStringEnd);
    setStatusTimeEnd(formatTimeStringEnd);
  }, []);

  useEffect(() => {
    if (stateWaring === true) {
      addNotification({
        title: "Warning",
        subtitle: "Đang có kẻ đột nhập",
        message: "Đang có kẻ đột nhập",
        theme: "red",
        duration: 5000,
        vibrate: true,
        native: true,
      });
    }
  }, [stateWaring]);

  useEffect(() => {
    socket.on("receive_system", (data) => {
      console.log(data);
      if (data === "on") {
        setStateSystem(true);
      } else {
        setStateSystem(false);
      }
    });

    socket.on("receive_bellWarning", (data) => {
      console.log(data);
      if (data === "on") {
        setStateBellWaring(true);
      } else {
        setStateBellWaring(false);
      }
    });

    socket.on("receive_warning", (data) => {
      console.log(data);
      if (data === "on") {
        setStateWaring(true);
        setStateBellWaring(true);
      } else {
        setStateWaring(false);
      }
    });

    socket.on("receive_timerOn", (data) => {
      console.log(data);
      if (data === "on") {
        setStateTimerOn(true);
      } else {
        setStateTimerOn(false);
      }
    });

    socket.on("receive_dateStart", (data) => {
      console.log(data);
      if (data) {
        setStatusDateStart(data);
      } else {
        setStatusDateStart("");
      }
    });

    socket.on("receive_timeStart", (data) => {
      console.log(data);
      if (data) {
        setStatusTimeStart(data);
      } else {
        setStatusTimeStart("");
      }
    });

    socket.on("receive_timerOff", (data) => {
      console.log(data);
      if (data === "on") {
        setStateTimerOff(true);
      } else {
        setStateTimerOff(false);
      }
    });

    socket.on("receive_dateEnd", (data) => {
      console.log(data);
      if (data) {
        setStatusDateEnd(data);
      } else {
        setStatusDateEnd("");
      }
    });

    socket.on("receive_timeEnd", (data) => {
      console.log(data);
      if (data) {
        setStatusTimeEnd(data);
      } else {
        setStatusTimeEnd("");
      }
    });
  }, [socket]);

  const handleControlWarning = () => {
    if (stateBellWaring) {
      console.log(stateBellWaring);
      socket.emit("send_bellWarning", "off");
      setStateBellWaring(false);
    } else {
      socket.emit("send_bellWarning", "on");
      setStateBellWaring(true);
    }
  };

  const handleControlSystem = () => {
    if (stateSystem) {
      console.log(stateSystem);
      socket.emit("send_system", "off");
      setStateSystem(false);
    } else {
      socket.emit("send_system", "on");
      setStateSystem(true);
    }
  };

  const handleOkDateStart = (date) => {
    const dateString = date.$d.toString();
    const originalDate = new Date(dateString);
    console.log(originalDate);
    localStorage.setItem("date", JSON.stringify(originalDate));
    const parsedDate = dayjs(dateString);
    const formatDateString = parsedDate.format("DD-MM-YYYY");
    const formatTimeString = parsedDate.format("HH:mm");
    setStatusDateStart(formatDateString);
    setStatusTimeStart(formatTimeString);
  };

  const handleOkDateEnd = (date) => {
    const dateString = date.$d.toString();
    const originalDate = new Date(dateString);
    console.log(originalDate);
    localStorage.setItem("dateend", JSON.stringify(originalDate));
    const parsedDate = dayjs(dateString);
    const formatDateString = parsedDate.format("DD-MM-YYYY");
    const formatTimeString = parsedDate.format("HH:mm");
    setStatusDateEnd(formatDateString);
    setStatusTimeEnd(formatTimeString);
  };

  const onChangeDateTimeStart = () => {
    if (stateTimerOn) {
      socket.emit("send_timerOn", "off");
      setStateTimerOn(false);
    } else {
      socket.emit("send_timerOn", "on");
      console.log(statusDateStart, statusTimeStart);
      socket.emit("send_dateStart", statusDateStart.toString());
      socket.emit("send_timeStart", statusTimeStart.toString());
      setStateTimerOn(true);
    }
  };

  const onChangeDateTimeEnd = () => {
    if (stateTimerOff) {
      socket.emit("send_timerOff", "off");
      setStateTimerOff(false);
    } else {
      socket.emit("send_timerOff", "on");
      console.log(statusDateEnd, statusTimeEnd);
      socket.emit("send_dateEnd", statusDateEnd.toString());
      socket.emit("send_timeEnd", statusTimeEnd.toString());
      setStateTimerOff(true);
    }
  };
  return (
    <div className="App">
      <div className="home-page">
        {stateWaring ? (
          <div>
            <Lottie
              animationData={Warning}
              style={{
                width: "100%",
                height: "50vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
            <h1 className="flash-text">Có người đột nhập</h1>
          </div>
        ) : (
          <div>
            <Lottie
              animationData={Home}
              style={{
                width: "100%",
                height: "50vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
            <h1 className="d-flex justify-content-center">
              Trạng thái an toàn
            </h1>
          </div>
        )}
      </div>
      <div className="container d-flex w-100 mt-3">
        <div className="d-flex justify-content-center w-50">
          <button
            className="my-button my-button-default"
            onClick={handleControlWarning}
          >
            {stateBellWaring ? "Tắt chuông cảnh báo" : "Bật chuông cảnh báo"}
          </button>
          {stateBellWaring ? (
            <Sound stateWarning={stateBellWaring} soundUrl={amthanh1} />
          ) : (
            ""
          )}
        </div>
        <div className="d-flex justify-content-center w-50">
          <button
            className="my-button my-button-default"
            onClick={handleControlSystem}
          >
            {stateSystem ? "Tắt hệ thống" : "Bật hệ thống"}
          </button>
        </div>
      </div>
      <div className="container d-flex w-100 mt-1">
        <p className="text-danger text-center d-flex w-50 justify-content-center">
          {stateBellWaring
            ? "Chuông báo động đang bật"
            : "Chuông báo động đang tắt"}
        </p>
        <p className="text-danger text-center d-flex w-50 justify-content-center">
          {stateSystem ? "Hệ thống đang hoạt động" : "Hệ thống đang tắt"}
        </p>
      </div>
      <div className="container d-flex justify-content-center flex-column mt-3">
        <div className="d-flex justify-content-center align-items-center text-center">
          <h3 className="me-3 text-center">Hẹn giời bật chống trộm: </h3>
          <Space direction="vertical" size={12}>
            <DatePicker
              format="YYYY-MM-DD HH:mm"
              disabledDate={disabledDate}
              disabledTime={disabledDateTime}
              showTime={{
                defaultValue: dayjs("00:00:00", "HH:mm:ss"),
              }}
              onOk={handleOkDateStart}
            />
          </Space>
          <Switch
            className="ms-2"
            onChange={onChangeDateTimeStart}
            checked={stateTimerOn ? true : false}
          />
        </div>
        {statusDateStart && (
          <p className="text-danger text-center mt-1">
            Bạn đã hẹn giờ bật chống trộm vào{" "}
            {statusDateStart + " " + statusTimeStart}
          </p>
        )}
      </div>
      <div className="container d-flex justify-content-center flex-column mt-3">
        <div className="d-flex justify-content-center align-items-center text-center">
          <h3 className="me-3 text-center">Hẹn giời tắt chống trộm: </h3>
          <Space direction="vertical" size={12}>
            <DatePicker
              format="YYYY-MM-DD HH:mm"
              disabledDate={disabledDate}
              disabledTime={disabledDateTime}
              showTime={{
                defaultValue: dayjs("00:00:00", "HH:mm:ss"),
              }}
              onOk={handleOkDateEnd}
            />
          </Space>
          <Switch
            className="ms-2"
            checked={stateTimerOff ? true : false}
            onChange={onChangeDateTimeEnd}
          />
        </div>
        {statusDateEnd && (
          <p className="text-danger text-center mt-1">
            Bạn đã hẹn giờ tắt chống trộm vào{" "}
            {statusDateEnd + " " + statusTimeEnd}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
