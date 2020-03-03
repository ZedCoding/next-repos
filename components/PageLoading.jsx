import { Spin } from "antd";
export default () => {
  return (
    <div className="spin-root">
      <Spin />
      <style jsx>{`
        .spin-root {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};
