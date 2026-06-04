export const WORLD_CONFIG = {
    name: '至高洪荒世界',
    version: '1.0.0',
    mapWidth: 4000,
    mapHeight: 4000,
    regions: [
        {
            id: 'chongxu',
            name: '终南山·清虚观',
            description: '李长寿修行的山门，仙气缭绕，道法昌盛',
            x: 0,
            y: 0,
            width: 800,
            height: 800,
            bgColor: '#1a2f1a'
        },
        {
            id: 'donghai',
            name: '东海之滨',
            description: '碧波万顷，仙岛林立',
            x: 800,
            y: 0,
            width: 800,
            height: 800,
            bgColor: '#1a3f5f'
        },
        {
            id: 'kunlun',
            name: '昆仑山',
            description: '万山之祖，仙气浓郁',
            x: 0,
            y: 800,
            width: 800,
            height: 800,
            bgColor: '#2a2a4a'
        },
        {
            id: 'huoyun',
            name: '火云洞',
            description: '三皇居所，威严神圣',
            x: 800,
            y: 800,
            width: 800,
            height: 800,
            bgColor: '#4a2a2a'
        }
    ]
};

export const CULTIVATION_REALMS = [
    { id: 1, name: '炼气期', color: '#888888', multiplier: 1 },
    { id: 2, name: '筑基期', color: '#00ff00', multiplier: 1.5 },
    { id: 3, name: '金丹期', color: '#ffd700', multiplier: 2 },
    { id: 4, name: '元婴期', color: '#ff69b4', multiplier: 3 },
    { id: 5, name: '化神期', color: '#00bfff', multiplier: 4 },
    { id: 6, name: '炼虚期', color: '#9932cc', multiplier: 5 },
    { id: 7, name: '合体期', color: '#ff4500', multiplier: 6 },
    { id: 8, name: '大乘期', color: '#ffff00', multiplier: 8 },
    { id: 9, name: '渡劫期', color: '#ff0000', multiplier: 10 },
    { id: 10, name: '真仙', color: '#ffffff', multiplier: 15 },
    { id: 11, name: '金仙', color: '#ffd700', multiplier: 20 },
    { id: 12, name: '太乙金仙', color: '#00ffff', multiplier: 30 },
    { id: 13, name: '大罗金仙', color: '#ff00ff', multiplier: 50 },
    { id: 14, name: '准圣', color: '#8b4513', multiplier: 100 },
    { id: 15, name: '圣人', color: '#ffd700', multiplier: 1000 }
];

export const SKILLS = {
    longevity: {
        id: 'longevity',
        name: '长生大道',
        description: '李长寿的核心功法，修炼此功可长生不老',
        icon: '🍃',
        damage: 0,
        effect: { type: 'buff', stat: 'maxHp', value: 100 }
    },
    taiji: {
        id: 'taiji',
        name: '太极图',
        description: '先天至宝，可演化阴阳，镇压气运',
        icon: '☯️',
        damage: 50,
        cooldown: 5000
    },
    qingping: {
        id: 'qingping',
        name: '青萍剑',
        description: '先天灵宝，杀伐无双',
        icon: '⚔️',
        damage: 30,
        cooldown: 2000
    },
    zhenwu: {
        id: 'zhenwu',
        name: '真武大帝法身',
        description: '召唤真武大帝法身助战',
        icon: '🗡️',
        damage: 100,
        cooldown: 15000
    }
};

export const NPC_DATA = [
    {
        id: 'master',
        name: '玉鼎真人',
        role: '师父',
        realm: 13,
        dialogue: [
            '长寿，你天资聪颖，好好修行。',
            '山下近日不太平，你且谨慎行事。',
            '为师观你机缘深厚，他日必成大器。'
        ],
        position: { x: 400, y: 400 }
    },
    {
        id: 'junior_sister',
        name: '云霄',
        role: '师姐',
        realm: 8,
        dialogue: [
            '师兄，你又在研究什么奇奇怪怪的法术？',
            '山下新开了一家点心铺，要不要一起去尝尝？',
            '听说东海那边出现了异动，师兄要小心。'
        ],
        position: { x: 450, y: 420 }
    },
    {
        id: 'senior_brother',
        name: '杨戬',
        role: '师兄',
        realm: 11,
        dialogue: [
            '师弟，来切磋一番？',
            '你的谨慎之道，颇有几分道理。',
            '天庭那边好像有动静...'
        ],
        position: { x: 350, y: 450 }
    }
];

export const QUESTS = [
    {
        id: 'main_1',
        type: 'main',
        title: '初入山门',
        description: '拜见师父玉鼎真人，了解修行之路',
        objectives: [
            { type: 'talk', target: 'master', description: '与玉鼎真人对话' }
        ],
        rewards: { exp: 100, gold: 50 }
    },
    {
        id: 'main_2',
        type: 'main',
        title: '修炼之道',
        description: '在清虚观内修炼，提升修为',
        objectives: [
            { type: 'cultivate', duration: 30, description: '修炼30秒' }
        ],
        rewards: { exp: 200, realm: 1 }
    },
    {
        id: 'side_1',
        type: 'side',
        title: '师姐的请求',
        description: '帮助云霄师姐寻找丢失的发簪',
        objectives: [
            { type: 'find', target: 'hairpin', description: '找到云霄的发簪' }
        ],
        rewards: { exp: 150, gold: 100 }
    }
];

export const ENEMIES = [
    {
        id: 'demon_spirit',
        name: '游魂',
        realm: 2,
        hp: 50,
        attack: 10,
        defense: 2,
        exp: 20,
        gold: 10
    },
    {
        id: 'ghost',
        name: '恶鬼',
        realm: 3,
        hp: 80,
        attack: 15,
        defense: 5,
        exp: 35,
        gold: 20
    },
    {
        id: 'demon_beast',
        name: '妖兽',
        realm: 4,
        hp: 150,
        attack: 25,
        defense: 10,
        exp: 60,
        gold: 40
    },
    {
        id: 'boss_dragon',
        name: '孽龙',
        realm: 7,
        hp: 1000,
        attack: 80,
        defense: 30,
        exp: 500,
        gold: 500,
        isBoss: true
    }
];