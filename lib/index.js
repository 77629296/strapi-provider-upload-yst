'use strict';

const axios = require('axios');

const log = (...args) => {
  strapi.log.debug('>>>>>>> upload <<<<<<<');
  strapi.log.debug(...args);
};

module.exports = {
  provider: 'yst-strapi-upload',
  name: 'YST Web Upload Service',
  auth: {
    configCode: {
      label: '文件配置编码code',
      type: 'text'
    },
    uploadUrl: {
      label: '上传地址',
      type: 'text'
    },
    operId: {
      label: '文件上传操作用户id',
      type: 'text'
    },
    operType: {
      label: '上传文件用户类型',
      type: 'text'
    },
  },
  init: (config) => {

    return {
      upload: (file) => {
        log(file);
        if (!file) return
        return new Promise((resolve, reject) => {
          const { name: originName, buffer } = file
          const { configCode, uploadUrl, operId, operType } = config
          const fileContent = buffer.toJSON().data

          if(!fileContent) return
 
          const params = {
            configCode,
            fileContent,
            originName,
            operId,
            operType
          }
          
          log('start upload...');
          axios({
            method: 'POST',
            url: uploadUrl,
            data: params
          }).then(function (response) {
            log(response.data);
            const { data } = response.data
            file.url = data.fileUrl
            resolve()
          })
          .catch(function (error) {
            log('error')
            reject(error)
          });
        });
      },
      delete: (file) => {
        return new Promise((resolve, reject) => {
          resolve()
        });
      }
    };
  }
};
