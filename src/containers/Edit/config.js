import './zh_cn';

export default {
  statusbar: false,
  resize: false,
  menubar: '',
  toolbar: 'code | undo redo | bold removeformat link image searchreplace t_image t_d2s t_simp2trad t_trad2simp',
  plugins: 'searchreplace autoresize code paste t_d2s t_simp_trad t_image',
  content_style:
    '*{line-height:25px;color:#555;font-size:15px;font-family:\'Hiragino Sans GB\',\'Microsoft YaHei\',\'黑体\',Helvetica,Arial,Tahoma,sans-serif;}' +
    'img{max-width:100%;}' +
    'img.size-overflowed{box-sizing:border-box;border:2px solid red;-webkit-filter:opacity(.4);filter:opacity(.4);}' +
    'table{width:100%}',
  extended_valid_elements: 'a[href|href-id|target=_blank|title]',
  convert_urls: false,
  paste_as_text: true,
  paste_data_images: true,
  paste_preprocess: function (plugin, e) {
    e.content = e.content.replace(/<br \/>/g, '</p><p>');
  },
  autoresize_min_height: 500,
};
