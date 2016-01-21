import React from 'react';
import {Upload, Icon} from 'tapas-ui';
import style from './style.less';

export default class ImageUploader extends React.Component {
  static propTypes = {
    onUploadImage: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    this.setState({url: nextProps.value || ''});
  }

  render() {
    let className = style.uploader;
    if (this.state.url) className += ' ' + style.hasImage;
    return (
      <div className={className}>
        <Upload.Dragger beforeUpload={::this.onBeforeUpload}>
          {this.state.url &&
              <img src={this.state.url} />
          }
          {!this.state.url && <Icon type="plus" />}
          <div className={style.buttonWrap}>
            <div className={style.buttons}>
              {this.state.url && <Icon type="cross" onClick={::this.onClear} />}
            </div>
          </div>
        </Upload.Dragger>
      </div>
    );
  }

  onBeforeUpload(file) {
    if (this.props.onUploadImage) {
      this.props.onUploadImage(file)
      .then(url => this.setImageUrl(url));
    }
    return false;
  }

  onClear(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setImageUrl('');
  }

  setImageUrl(url) {
    this.setState({url});
    this.props.onChange && this.props.onChange(url);
  }
};
