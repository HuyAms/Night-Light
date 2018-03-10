import {Injectable} from "@angular/core";
import {FileTransfer, FileTransferObject, FileUploadOptions} from '@ionic-native/file-transfer';


@Injectable()
export class MediaService {
  constructor( private transfer: FileTransfer,) {}

  uploadFile(title: string, description: string, imageURI) {
    return new Promise((resolve, reject) => {
      const fileTransfer: FileTransferObject = this.transfer.create();
      const apiUrl = 'http://media.mw.metropolia.fi/wbma/media';

      let options: FileUploadOptions = {
        fileKey: 'file',
        fileName: 'ionicfile',
        httpMethod: 'POST',
        mimeType: "image/jpeg",
        headers: {
          'x-access-token': localStorage.getItem('token')
        },
        params: {
          title: title,
          description: description
        }
      }


      // let options: FileUploadOptions = {
      //   fileKey: 'file',
      //   fileName: 'ionicfile',
      //   httpMethod: 'POST',
      //   mimeType: "image/jpeg",
      //   headers: {
      //     'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxOCwidXNlcm5hbWUiOiJ6ZXVzbG10IiwiZW1haWwiOiJ0dWFubEBtZXRyb3BvbGlhLmZpIiwiZnVsbF9uYW1lIjoiVHVhbiBMZSIsImlzX2FkbWluIjpudWxsLCJ0aW1lX2NyZWF0ZWQiOiIyMDE4LTAxLTI5VDExOjE4OjUzLjAwMFoiLCJpYXQiOjE1MjA2MzU0NDIsImV4cCI6MTUyMjcwOTA0Mn0.vZVb2ZArRvl1apqF-hZS6SD1ONdxjsPPa9mBtu64mpo'
      //   },
      //   params: {
      //     title: 'dmAndroid',
      //     description: 'DMMM'
      //   }
      // }

      fileTransfer.upload(imageURI, apiUrl, options)
        .then((data) => {
          console.log('successfulllyyyyyyyyy');
          //resolve(data);
        }, (err) => {
          console.log('errorrrrrrrrrr');
          console.log(err);
         //reject(err);
        });
    })


  }
}
