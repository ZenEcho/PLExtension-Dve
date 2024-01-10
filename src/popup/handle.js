export function getUrlText(event) {
    let range = document.createRange();
    range.selectNodeContents(event.currentTarget);
    let sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

// 假设这段代码在组件的方法中
export function copyUrlText(event, callback) {
    let elementToCopy = event.currentTarget.parentNode.querySelector(".url-text").textContent;
    navigator.clipboard.writeText(elementToCopy)
        .then(() => {
            callback({ message: "复制成功！", type: "success" });
        })
        .catch(err => {
            callback({ message: "复制失败！", type: "error" });
        });
}

