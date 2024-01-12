import { dbHelper } from '@/assets/js/db';
import { taskQueue } from '@/assets/js/taskQueue';
import { getChromeStorage, LocalStorage } from '@/assets/js/public';
export function setUpload(Dropzone) {
    return new Promise((resolve, reject) => {
        getChromeStorage("ProgramConfiguration").then((result) => {
            let ProgramConfigurations = result
            switch (ProgramConfigurations.program) {
                case 'Lsky':
                    Dropzone.options.url = "https://" + ProgramConfigurations.Host + "/api/v1/upload";
                    Dropzone.options.headers = { "Authorization": ProgramConfigurations.Token };
                    Dropzone.options.paramName = 'file';
                    Dropzone.options.acceptedFiles = '.jpeg,.jpg,.png,.gif,.tif,.bmp,.ico,.psd,.webp';
                    Dropzone.on("sending", function (file, xhr, formData) {
                        if (ProgramConfigurations.Source) {
                            formData.append("strategy_id", ProgramConfigurations.Source);
                        }
                        if (ProgramConfigurations.Album_id) {
                            formData.append("album_id", ProgramConfigurations.Album_id);
                        }
                        formData.append("permission", ProgramConfigurations.Permission);
                    })
                    break;
            }
            resolve(ProgramConfigurations)
        })
    });

}


