"use strict";
(() => {
    const query = new URLSearchParams(location.search);
    // 尽早清除浏览器地址/历史中的授权码；不加载统计、图片或第三方脚本。
    history.replaceState(null, "", location.pathname);
    const status = document.getElementById("status");
    const state = query.get("state") || "";
    const match = /^winfu\.([1-9][0-9]{3,4})\.([A-Za-z0-9_-]{43})$/.exec(state);
    const code = query.get("code");
    const error = query.get("error");
    if (!match || +match[1] < 1024 || +match[1] > 65535 || query.getAll("state").length !== 1
        || query.getAll("code").length > 1 || query.getAll("error").length > 1
        || Boolean(code) === Boolean(error)) {
        status.textContent = "登录信息无效或已过期，请回到 Winfu 重新点击登录 Trakt。";
        return;
    }
    // 只允许固定的本机地址和路径。顶层导航不需要跨域 fetch 或本地网络权限。
    const target = new URL(`http://127.0.0.1:${match[1]}/trakt/callback/`);
    target.searchParams.set("state", state);
    if (code) target.searchParams.set("code", code);
    else target.searchParams.set("error", error);
    const link = document.getElementById("return");
    link.href = target.href;
    link.hidden = false;
    status.textContent = "正在返回 Winfu。如果浏览器没有自动跳转，请点击下方按钮。";
    location.replace(target.href);
})();
