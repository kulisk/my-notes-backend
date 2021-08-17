export class FileHelper {
  static customFileName(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const splitFileName = file.originalname.split('.');
    const fileExtension = splitFileName[splitFileName.length - 1];
    const originalName = splitFileName[0];
    cb(null, originalName + '-' + uniqueSuffix + '.' + fileExtension);
  }

  static destinationPath(req, file, cb) {
    cb(null, './upload');
  }
}
