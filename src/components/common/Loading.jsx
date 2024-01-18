import { LoadingOutlined } from "@ant-design/icons";

import "./Loading.scss";

const Loading = (props) => {
  return (
    <div className={styles.loading}>
      <LoadingOutlined
        spin
        rotate={360}
        style={{ color: props.color, fontSize: props.size }}
      />
    </div>
  );
};

Loading.defaultProps = {
    size: 40
}

export default Loading;
