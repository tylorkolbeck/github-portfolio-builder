const fs = require("fs");

/**
 *
 * @param {string} filename    Filename to create and write data to
 * @param {string} data        Data to write to a file
 * @return {bool}              True if write successful else false
 *
 */
function writeToFile(filename, data) {
  // fs.writeFile(filename, JSON.stringify(data, null, " "), err => {
  fs.writeFile(filename, data, err => {
    if (err) {
      return false;
    } else {
      return true;
    }
  });
}

/**
 *
 * Creates a file stream to append errors to a log file.
 * @param {string}      filename    Filename to create and write data to
 * @return {function}               A file handle to be used for writing to the error log
 *
 */
function createFileStreamHandle(filename) {
  let stream = fs.createWriteStream(filename, { flags: "a" });
  return stream;
}

/**
 *
 * Creates a file stream to append errors to a log file.
 * @param {handle}      fileHandle    File handle
 *
 */
function writeToStream(fileHandle, data) {
  let date = new Date().toISOString();
  fileHandle.write(date + ":\n" + data + "\n");
}

module.exports = {
  writeToFile,
  createFileStreamHandle,
  writeToStream
};
