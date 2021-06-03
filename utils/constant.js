/* const UPLOAD_PATH = 'F:/management-system/upload/upload-ebook'
const UPLOAD_URL = 'http://localhost:8001/upload-ebook'
const OLD_UPLOAD_URL = 'http://localhost:8001/book' */

const UPLOAD_PATH = '/usr/local/nginx/upload/upload-ebook'
const UPLOAD_URL = 'http://121.41.178.240/upload-ebook'

module.exports = {
  CODE_ERROR: -1,
  CODE_SUCCESS: 0,
  CODE_TOKEN_EXPIRED: -2,
  debug: true,
  PWD_SALT: 'chen',
  PRIVATE_KEY: 'chen',
  JWT_EXPIRED: 60*60,
  UPLOAD_PATH ,
  UPLOAD_URL,
  MIME_TYPE_EPUB: 'application/epub',

}