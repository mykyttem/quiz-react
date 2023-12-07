const msg_internalServer = 'Internal server error';
const msg_failed_db = 'Failed to fetch quiz data from the database';


const executeQuery = async (db, query, params, method = 'get') => {
  return new Promise((resolve, reject) => {
    db[method](query, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const sendResponse = (res, status, data) => {
    res.status(status).json(data);
};


module.exports = {
    msg_internalServer,
    msg_failed_db,

    executeQuery,
    sendResponse
  };