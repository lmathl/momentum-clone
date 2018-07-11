import React from "react";

class EditableTextarea extends React.Component {
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
        <textarea
          rows="7" cols="40"
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
      <pre
        onDoubleClick={() => {
          this.setState({ editing: true });
        }}
      >
        {children}
      </pre>
    );
  }
}

export default EditableTextarea;