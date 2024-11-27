
/*

 @name    : 锅巴汉化 - Web汉化插件
 @author  : 麦子、JAR、小蓝、好阳光的小锅巴
 @version : V0.6.1 - 2019-07-09
 @website : http://www.g8hh.com

*/

//1.汉化杂项
var cnItems = {
    _OTHER_: [],
	
    'You have': '你有',
    'You have ': '你有',
    'points': '点数',
    ' points': '点数',
    'Milestone Gotten!': '获得里程碑！',
	'Achievement Gotten!': '获得成就！',
    'Start': '开始',
    'Exit Early': '提前退出',
    'Completed': '已完成',
    'Finish': '完成挑战',
	
    'HARD RESET': '硬复位',
    'ON': '开启',
    'OFF': '关闭',
    'Save': '保存',
    'Export to clipboard': '导出到剪贴板',
    'Export': '导出',
    'Import': '导入',
    'You have': '你有',
    'ALWAYS': '一直',
    'Default': '默认',
    'Aqua': '水色',
    'HIDDEN': '隐藏',
    'AUTOMATION': '自动',
    'SHOWN': '显示',
    'INCOMPLETE': '未获得',
    'NEVER': '从不',
	
	'Hotkeys': '热键',
	
    //原样
    '': '',
    '': '',

}


//需处理的前缀
var cnPrefix = {
    "Autosave: ": "自动保存：",
    "Offline Prod: ": "离线生产：",
    "Offline Time": "离线时间",
    "Theme: ": "主题：",
    "Show Milestones: ": "显示里程碑：",
    "Completed Challenges: ": "完成的挑战：",
    "High-Quality Tree: ": "高画质的树：",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
}

//需处理的后缀
var cnPostfix = {
}

//需排除的，正则匹配
var cnExcludeWhole = [
    /^x?\d+(\.\d+)?[A-Za-z%]{0,2}(\s.C)?\s*$/, //12.34K,23.4 °C
    /^x?\d+(\.\d+)?(e[+\-]?\d+)?\s*$/, //12.34e+4
    /^\s*$/, //纯空格
    /^\d+(\.\d+)?[A-Za-z]{0,2}.?\(?([+\-]?(\d+(\.\d+)?[A-Za-z]{0,2})?)?$/, //12.34M (+34.34K
    /^(\d+(\.\d+)?[A-Za-z]{0,2}\/s)?.?\(?([+\-]?\d+(\.\d+)?[A-Za-z]{0,2})?\/s\stot$/, //2.74M/s (112.4K/s tot
    /^\d+(\.\d+)?(e[+\-]?\d+)?.?\(?([+\-]?(\d+(\.\d+)?(e[+\-]?\d+)?)?)?$/, //2.177e+6 (+4.01+4
    /^(\d+(\.\d+)?(e[+\-]?\d+)?\/s)?.?\(?([+\-]?(\d+(\.\d+)?(e[+\-]?\d+)?)?)?\/s\stot$/, //2.177e+6/s (+4.01+4/s tot
];
var cnExcludePostfix = [
    /:?\s*x?\d+(\.\d+)?(e[+\-]?\d+)?\s*$/, //12.34e+4
    /:?\s*x?\d+(\.\d+)?[A-Za-z]{0,2}$/, //: 12.34K, x1.5
]

//正则替换，带数字的固定格式句子
//纯数字：(\d+)
//逗号：([\d\.,]+)
//小数点：([\d\.]+)
//原样输出的字段：(.+)
var cnRegReplace = new Map([
	[/You have (.+)/, '你有 $1'],
	[/Req:(.+)\/ Infinity(.+)/, '需要：$1/ 无限$2'],
	[/Req:(.+)/, '需要：$1'],
	[/Next at Infinity(.+)/, '下一个需要 无限$1'],
	[/Next at(.+)/, '下一个需要$1'],
	[/(.+)\/ Infinity(.+)/, '$1/ 无限$2'],
	[/You are gaining(.+)per second/, '你正在获得$1每秒'],
	[/\((.+)\/sec\)/, '($1/秒)'],
	[/Cost: Infinity(.+)/, '花费：无限$1'],
	[/Cost:(.+)/, '花费：$1'],
	[/Currently:(.+)/, '当前：$1'],
	[/Reward:(.+)/, '奖励：$1'],
	[/Goal:(.+)/, '目标：$1'],
	[/Time Played:(.+)/, '游戏时间：$1'],
	[/Reset for (.+)/, '重置以获得 $1'],
]);