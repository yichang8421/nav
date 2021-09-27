const $siteList = $('.siteList');
const lastLi = $siteList.find('li.last');
// 读出localStorage中之前存储的x值
const x = localStorage.getItem('x');

//将x变成对象
const xObject = JSON.parse(x);

const hashMap = xObject || [
    {logo: 'B', logoType: 'text', url: 'https://bilibili.com'},
    {logo: 'C', logoType: 'image', url: 'https://codepen.io/pen/'},
    {logo: 'F', logoType: 'image', url: 'https://freecodecamp.org/learn/'},
    {logo: 'G', logoType: 'text', url: 'https://github.com/'},
    {logo: 'N', logoType: 'text', url: 'https://nicovideo.jp/'},
    {logo: 'W', logoType: 'text', url: 'https://zh.wikipedia.org'},
    {logo: 'V', logoType: 'text', url: 'https://vuejs.org/'},
    {logo: 'R', logoType: 'text', url: 'https://reactjs.org/'},
];

const simplifyUrl = (url) => {
    return url.replace('https://', '')
        .replace('https://', '')
        .replace('www.', '')
        .replace(/\/.*/, ''); //删除/之后的所有内容
}

const render = () => {
    // 重新渲染hashMap之前，将之前渲染过的hashMap全部删除。然后渲染新增加li的hashMap。
    // console.log($siteList.find('li.last')[0].innerText);
    $siteList.find('li:not(.last)').remove();

    // 优化：可以使用hashMap.slice(2:)从第三个元素开始渲染
    hashMap.forEach((node, index) => {
        // console.log(index);
        const $li = $(`
        <li>
            <div class="site">
                <div class="logo">${node.logo}</div>
                <div class="link">${simplifyUrl(node.url)}</div>
                <div class="close">
                    <svg class="icon">
                        <use xlink:href="#icon-baseline-close-px"></use>
                    </svg>
                </div>
            </div>
        </li> 
    `).insertBefore(lastLi);

        /* 页面跳转功能 */
        $li.on('click', (e) => {
            window.open(node.url);
        });

        /* 删除功能 */
        $li.on('click', '.close', (e) => {
            e.stopPropagation();
            // console.log(hashMap);
            hashMap.splice(index, 1,);
            render();
        });
    });
}

render();
/*
*   <li>
        <a href="https://www.acfun.cn/">
            <div class="site">
                <div class="logo">A</div>
                <div class="link">acfun.cn</div>
            </div>
        </a>
    </li>
    <li>
        <a href="//bilibili.com">
            <div class="site">
                <div class="logo">
                    <img src="./img/bilibiliLogo.jpeg" alt="">
                </div>
                <div class="link">bilibili.com</div>
            </div>
        </a>
    </li>
*
*
* */

$('.addButton')
    .on('click', () => {
        let url = window.prompt('请输入您要添加的网址：');
        console.log(url);
        if (!url && url !== null) {
            window.alert("输入不能为空哦");
            return;
        }
        if (url.indexOf('https') !== 0) {
            url = 'https://' + url;
        }
        console.log(url);
        hashMap.push({
            logo: simplifyUrl(url)[0],
            // 可以使用.toUpperCase()大写，也可以使用css控制logo大写，此处选择后者。
            logoType: 'text',
            url: url,
        });

        render();
    });

window.onbeforeunload = () => {
    /* 用户关闭页面之前触发。 */
    console.log('页面将关闭');
    // localstorage只能存储字符串
    // jQuery对象变成字符串：
    // const string = hashMap.toString(); 错误
    const string = JSON.stringify(hashMap);

    // 将string存入localStorage
    localStorage.setItem('x', string);
};

// 键盘事件
$(document).on('keypress', (e) => {
    const {key} = e;
    //const key = e.key;
    // console.log(key);
    for (let i = 0; i < hashMap.length; i++) {
        if (hashMap[i].logo.toLowerCase() === key) {
            window.open(hashMap[i].url);
        }
    }
})