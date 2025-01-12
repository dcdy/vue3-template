// uno.config.ts
import {
    defineConfig,
    // 属性化模式，属性冲突时，可以通过默认un-前缀来解决：<div m-2 rounded text-teal-400 >代替class</div>
    presetAttributify,
    // 可以自定义图标转换
    presetIcons,
    presetTypography,
    // 预设，可以自定义
    presetUno,
    // 使用你自己的函数来获取字体来源
    presetWebFonts,
    // 别名，默认启用,指令：@apply等
    transformerDirectives,
    /**
     * 变型组Transformer，方便书写
     * 前缀组合：class="hover:(bg-gray-400 font-medium) font-(light mono)"
     * 将转变为：class="hover:bg-gray-400 hover:font-medium font-light font-mono"
     */
    transformerVariantGroup
} from 'unocss';
import presetRemToPx from '@unocss/preset-rem-to-px';
const DIRECTION_MAPPIINGS = { t: 'top', r: 'right', b: 'bottom', l: 'left' };
export default defineConfig({
    rules: [
        // [/^m-(\d+)$/, (match) => ({ margin: `${+match[1] * 10}px` })]
        // `flex items-${match[1]} ${match[2] ? 'justify-' + match[2] : 'justify-' + match[1]}`
    ],
    // 构建边框类名数组
    shortcuts: [
        // 使用：b-d[10px_solid_red]
        [
            /^b-?(t|r|b|l|d)?(?:([trlb]+))?\[(.*)\]$/,
            ([, direction1, directions, config]) => {
                const directionMap = {
                    t: 't',
                    r: 'r',
                    b: 'b',
                    l: 'l',
                    d: 'all' // 特殊标识，表示全边框
                };

                // 处理第一个方向
                const dir1 = directionMap[direction1] || '';
                // 处理多个方向
                const dirList = directions ? directions.split('') : [];

                // 解析边框配置
                const [borderWidth = '1px', borderStyle = 'solid', borderColor = 'black'] =
                    config.split('_');

                // 构建边框类名数组
                const borderClasses: string[] = [];

                // 添加指定的方向的边框
                if (dir1) {
                    if (dir1 === 'all') {
                        borderClasses.push(`border-${borderWidth}`);
                        borderClasses.push(`border-${borderStyle}`);
                        borderClasses.push(`border-${borderColor}`);
                    } else {
                        borderClasses.push(`border-${dir1}-${borderWidth}`);
                        borderClasses.push(`border-${dir1}-${borderStyle}`);
                        borderClasses.push(`border-${dir1}-${borderColor}`);
                    }
                }

                if (dirList.length > 0) {
                    dirList.forEach((dir) => {
                        const dirMapped = directionMap[dir] || dir;
                        if (dirMapped !== 'all') {
                            borderClasses.push(`border-${dirMapped}-${borderWidth}`);
                            borderClasses.push(`border-${dirMapped}-${borderStyle}`);
                            borderClasses.push(`border-${dirMapped}-${borderColor}`);
                        }
                    });
                }

                // 确保未指定的方向边框为 none
                if (dir1 !== 'all') {
                    const allDirections = ['t', 'r', 'b', 'l'];
                    allDirections.forEach((d) => {
                        if (!dirList.includes(d) && d !== dir1) {
                            borderClasses.push(`border-${d}-none`);
                        }
                    });
                }

                return borderClasses.join(' ');
            }
        ],
        // 使用：flex[center,center]
        [
            /^flex(-1|-col|-wrap)?\[([a-z]*)(?:,([a-z]*))?\]$/,
            (match) =>
                `flex flex${match[1] ? match[1] : ''} ${match[2] ? 'items-' + match[2] : ''}  ${
                    match[3] == undefined
                        ? 'justify-' + match[2]
                        : match[3]
                        ? 'justify-' + match[3]
                        : ''
                }`
        ],
        // 使用：full
        { full: `w-full h-full` },
        // 使用：position[t-0,l-0]
        [
            /^position?\[([trlb]-.+?)(?:,([trlb]-.+?))?(?:,([trlb]-.+?))?(?:,([trlb]-.+?))?\]?$/,
            (match) => {
                let position = `absolute`;
                const obj = {
                    t: 'top-',
                    r: 'right-',
                    l: 'left-',
                    b: 'bottom-'
                };
                for (let i = 1; i < match.length; i++) {
                    if (match[i]) {
                        // 解析方向和值
                        const [dir, value] = match[i].split(/-(.+)/);
                        position += ` ${obj[dir]}${value}`;
                    }
                }
                return position;
            }
        ],
        // 使用：abs-center
        {
            'abs-center': `absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`
        },
        // 使用：p[10px,20px,30px,40px]
        [
            /^p\[(.+)\]$/,
            ([, values]) => {
                const paddingValues = values.split(',');
                const length = paddingValues.length;

                switch (length) {
                    case 1:
                        return `p-${paddingValues[0]} box-border`;
                    case 2:
                        return `px-${paddingValues[1]} py-${paddingValues[0]} box-border`;
                    case 3:
                        return `pt-${paddingValues[0]} pr-${paddingValues[1]} pb-${paddingValues[2]} pl-${paddingValues[1]} box-border`;
                    case 4:
                        return `pt-${paddingValues[0]} pr-${paddingValues[1]} pb-${paddingValues[2]} pl-${paddingValues[3]} box-border`;
                    default:
                        return '';
                }
            }
        ]
        // [/^btn-(.*)$/, ([, c]) => `bg-${c}-400 text-${c}-100 py-2 px-4 rounded-lg`]
    ],
    theme: {
        colors: {
            // ...
        }
    },
    presets: [
        presetUno(),
        presetAttributify(),
        presetIcons(),
        presetTypography(),
        presetWebFonts({
            fonts: {
                // ...
            }
        }),
        presetRemToPx({ baseFontSize: 4 }) // rem转px
    ],
    transformers: [transformerDirectives(), transformerVariantGroup()],
    content: {
        pipeline: {
            exclude: [
                'node_modules',
                'dist',
                '.git',
                '.husky',
                '.vscode',
                'public',
                'build',
                'mock',
                'assets',
                '.scss'
            ]
        }
    }
});
