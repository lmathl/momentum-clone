import React from "react";

class EditableText extends React.Component {
  constructor() {
    super();
    this.state = {
      editing: false
    };
  }

  render() {
    const { children, onChange } = this.props;
    const { editing } = this.state;

    if (editing) {
      return (
        <input
            className="editing"
            autoFocus
            onBlur={() => {
            this.setState({ editing: false });
            }}
            onChange={onChange}
            defaultValue={children}
        />
      );
    }

    return (
      <span
        onDoubleClick={() => {
          this.setState({ editing: true });
        }}
      >
        {children}
      </span>
    );
  }
}

export default EditableText;