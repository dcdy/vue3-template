/**
 * TAG将 Base64 编码的图片转换为 Blob 对象。
 *
 * @param {string} dataurl - Base64 编码的图片数据。
 * @returns {Blob} - 返回一个 Blob 对象，包含图片的二进制数据。
 *
 * @example
 * const blob = dataURLtoBlob('data:image/png;base64,iVBORw0...');
 */
export function dataURLtoBlob(dataurl: string): Blob {
    let arr = dataurl.split(',');
    let match = arr[0].match(/:(.*?);/);
    let mime = match ? match[1] : '';
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
}

/**
 * TAG下载文件，支持直接下载文件 URL。
 *
 * @param {string} url - 要下载的文件 URL。
 * @param {string} name - 下载时的文件名。
 *
 * @example
 * downloadFile('https://example.com/file.png', 'downloadedFile.png');
 */
export function downloadFile(url: string, name: string): void {
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', name);
    a.setAttribute('target', '_blank');

    let clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent('click', true, true);
    a.dispatchEvent(clickEvent);
}

/**
 * TAG下载 Base64 编码的图片。
 *
 * @param {string} base64 - Base64 编码的图片数据，必须带有前缀（如：`data:image/png;base64,`）。
 * @param {string} name - 下载时的文件名。
 *
 * @example
 * downloadFileByBase64('data:image/png;base64,iVBORw0...', 'image.png');
 */
export function downloadFileByBase64(base64: string, name: string): void {
    const myBlob = dataURLtoBlob(base64);
    const myUrl = URL.createObjectURL(myBlob);
    downloadFile(myUrl, name);
}

/**
 * TAG将 Base64 编码的图片转换为可下载的 URL（Blob URL）。
 * 需要带前缀'data:image/png;base64,'
 *
 * @param {string} base64 - Base64 编码的图片数据，必须带有前缀（如：`data:image/png;base64,`）。
 * @returns {string} - 返回一个 Blob URL。
 *
 * @example
 * const imageUrl = Base64ToUrl('data:image/png;base64,iVBORw0...');
 * console.log(imageUrl); // Blob URL
 */
export function Base64ToUrl(base64: string): string {
    const myBlob = dataURLtoBlob(base64);
    return URL.createObjectURL(myBlob);
}

import { ElMessage } from 'element-plus';
/**
 * TAG文件上传数量、类型、大小校验。
 *
 * @param {FileList} filesObj - 文件对象。
 * @param {number} minFileNum - 最少文件数。
 * @param {number} maxFileNum - 最多文件数。
 * @param {string[]} confirmTypeArr - 限制文件类型（例如：`['image/jpeg', 'image/png']`）。
 * @param {number} confirmSize - 限制文件大小（单位：MB）。
 * @param {string} countOverMsg - 文件超出个数时的提示信息。
 * @param {boolean} [isErrorReturn=true] - 是否遇到不符合条件的文件时立即返回 `false`。
 *
 * @returns {File[]} - 返回符合条件的文件列表。
 *
 * @example
 * const files = fileCountCheck(fileInput.files, 1, 5, ['image/jpeg', 'image/png'], 5, '文件个数不符合要求');
 * console.log(files); // 返回符合要求的文件列表
 */
export function fileCountCheck(
    filesObj: { files: FileList },
    minFileNum: number,
    maxFileNum: number,
    confirmTypeArr: string[],
    confirmSize: number,
    countOverMsg: string,
    isErrorReturn: boolean = true
): File[] | false {
    console.log(
        '上传文件对象',
        filesObj.files,
        minFileNum,
        maxFileNum,
        confirmTypeArr,
        confirmSize,
        countOverMsg
    );

    let fileList = Array.from(filesObj.files);

    if (window.File && window.FileList) {
        var fileCount = fileList.length;

        // 如果数量超出了
        if (fileCount < minFileNum || fileCount > maxFileNum) {
            if (countOverMsg) {
                ElMessage.warning(countOverMsg);
            } else {
                ElMessage.warning(`最多选择${maxFileNum}张图片`);
            }
            return false;
        }

        // 类型和大小校验
        let isConfirmType = true;
        let isConfirmSize = true;

        const filteredList = fileList.filter((item) => {
            let isTypeMatch = true;
            if (confirmTypeArr) {
                if (!confirmTypeArr.includes(item.type)) {
                    isConfirmType = false;
                    isTypeMatch = false;
                }
            }

            let isSizeMatch = item.size / 1024 / 1024 <= confirmSize;
            if (!isSizeMatch) {
                isConfirmSize = false;
            }

            return isTypeMatch && isSizeMatch;
        });

        if (!isConfirmType) {
            ElMessage.warning('上传文件只能是常见图片格式!');
            if (isErrorReturn) {
                return false;
            }
        }

        if (!isConfirmSize) {
            const sizeMsg =
                confirmSize < 1024
                    ? `上传文件大小不能超过${confirmSize}MB!`
                    : `上传文件大小不能超过${confirmSize / 1024}GB!`;
            ElMessage.warning(sizeMsg);
            if (isErrorReturn) {
                return false;
            }
        }

        return filteredList;
    } else {
        ElMessage.error('抱歉，你的浏览器不支持FileAPI，请升级浏览器！');
        return false;
    }
}
