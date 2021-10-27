const imageminMozjpeg = require('imagemin-mozjpeg')
const ImageminPlugin = require('imagemin-webpack-plugin').default //Импортируем 2 пакета, которые позже Webpack будет использовать для обработки и сжатия изображений.

const isDev = process.env.NODE_ENV !== 'production' //Для удобства создаём константу, которую будем использовать в качестве флага на некоторых пунктах конфига.

module.exports = {
    mode: 'universal',  //Задаём явно, что мы хотим получить SSR приложение (а не SPA)
    ...(!isDev && {
        modern: 'client' //Используем ES6 синтаксис для динамического расширения объекта. В данном случае !isDev означает, что modern: 'client' свойство объекта будет добавлено только в production. modern: 'client' говорит Nuxt создать 2 бандла, один из которых использует ES6 Modules синтаксис поддерживаемый последними браузерами, а второй Legacy транспилированный через Babel. В html будет по 2 тега на каждый js скрипт вида: <script nomodule src="***" defer></script><script type="module" src="***" defer> Браузер будет загружать только один из пары.
    }),

    head: {
        htmlAttrs: {
            lang: 'ru'
        },
        title: 'Nuxt Magazine',
        meta: [
            { hid: 'description', name: 'description', content: 'Интернет-магазин' }
        ],
        link: [
            { rel: 'shortcut icon', href: 'favicon.ico' }
        ]
    }, //Создаём дефолтный Head
    rootDir: __dirname, //Явно прописываем что считать корнем проекта при использовании абсолютных путей импорта
    serverMiddleware: [
    ],
    router: {
        prefetchLinks: false    //Отключаем дефолтный механизм Nuxt, который улучшает восприятие UI в некоторых случаях. Этот механизм подгружает страницу как только ссылка на неё попадает в область видимости окна браузера. То есть ещё до клика на ссылку, страница будет уже загружена и пользователь без задержки откроет ссылку. Но в интернет-магазине будут сотни ссылок и нам не нужно, чтобы каждая из них автоматически подгружалась (если у вас слабый сервер, а у клиентов 2G).
    },
    loading: { color: '#ddd' }, //Бегущая полоска при загрузке страниц, вверху страницы. Это индикатор загрузки, которому можно задать любой цвет или отключить или вставить свой.
    css: [
        'normalize.css', //Задаем глобальные стили для всего приложения. В данном случае подключаем стили из пакета normalize, для сброса дефолтных стилей.
        // './assets/scss/global-styles.scss'
    ],
    plugins: [
    ],
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
        'nuxt-trailingslash-module',
        'nuxt-webfontloader',
        'cookie-universal-nuxt',
        '@nuxtjs/style-resources'
        //Подключаем Nuxt модули, которые по сути являются обычными плагинами для Vue, но уже со встроенным механизмом install, который их запускает в нужном месте. Нам не нужно их вручную добавлять во Vue instance, а только прописать для некоторым из них конфиги
    ],
    //Задаем конфиг для модуля nuxt-webfontloader. Указываем какой шрифт хотим загрузить. В данном случае берём открытый шрифт из Google Fonts. Когда все шрифты будут загружены, модуль добавит в html тег, класс wf-active. &display=swap означает, что после получения html, когда браузер начнет исполнять js код, это модуль динамически добавит css файл с нужными нам шрифтами. Так же этот модуль умеет вызывать хуки на всех этапах загрузки, но они нам не нужны сейчас, поэтому пропишем events: false.
    webfontloader: {
        events: false,
        google: {
            families: ['Montserrat:400,500,600:cyrillic&display=swap']
        },
        timeout: 5000
    },
    //Задаем конфиг для модуля @nuxtjs/style-resources. Этот модуль автоматически импортирует указанные файлы стилей для всех компонентов. Обычно используется для подключения глобальных переменных SCSS на весь проект. В данном случае у нас ещё нет файла global-variables.scss, но мы его добавим позже, а модуль не вызовет ошибку, если не найдет файл.
    styleResources: {
        // your settings here
        // scss: ['./assets/scss/global-variables.scss'], // alternative: scss
        less: [],
        stylus: []
    },
    /*
    ** Задаем конфиг для модуля axios
    */
    axios: {
        // See https://github.com/nuxt-community/axios-module#options
    },
    //Nuxt из коробки имеет под капотом Web Server, который умеет в http2. Но так как проект сейчас на localhost, а для http2 нужен https, то дабы не городить костыли мы просто не будет включать пока что эту опцию.
    // compressor это Gzip сжатие, которое по умолчанию отдаёт всё сжатым (html, js, css, статику). Подробнее об этом можно почитать здесь https://www.npmjs.com/package/compression Я лишь добавлю, что у себя в production я эту опцию отключил compressor: false так как там Nuxt используется только для render, а всю статику отдаёт Nginx с настроенным сжатием, поэтому дабы дважды не делать одну и ту же работу, можно это отключить. Но для примера мы будем использовать Nuxt для отдачи статики и не будем трогать эту опцию.
    // То же самое и с etag, если будет использоваться Nginx, то стоит явно отключить etags.
    // resourceHints мы явно отключим, чтобы не предзагружать страницы (из той же оперы что и prefetchLinks: false)
    render: {
        // http2: {
        //     push: true,
        //     pushAssets: (req, res, publicPath, preloadFiles) => preloadFiles
        //     .map(f => `<${publicPath}${f.file}>; rel=preload; as=${f.asType}`)
        //   },
        // compressor: false,
        resourceHints: false,
        etag: false,
        static: {
            etag: false
        }
    },
    /*
    ** Build configuration
    */
    build: {
        optimizeCss: false, //Так как позже мы будет использовать cssNano со своими настройками, отключаем дефолтный механизм оптимизации стилей.
        filenames: {
            //Nuxt сам подставит в Webpack эту часть конфига. Здесь мы задаем то, что во время development хотим видеть красивые имена файлов, а в production build раскидываем файлы по папкам и в качестве имени используем contenthash. Это элегантное решение распространённой проблемы, когда вы скажем обновили приложение на production, а у клиентов все js скрипты и стили в кеше бразуера. Чтобы инвалидировать этот кеш, мы просто каждый раз генерируем у всех файлов название, которое является хеш-функцией контента внутри этого файла. Соответственно если какой-то файл поменяется, то при следующем заходе пользователя на страницу, браузер будет требовать уже файл с другим именем, а те что не поменялись останутся с тем же именем и будут взяты и с кеша браузера.
            app: ({ isDev }) => isDev ? '[name].js' : 'js/[contenthash].js',
            chunk: ({ isDev }) => isDev ? '[name].js' : 'js/[contenthash].js',
            css: ({ isDev }) => isDev ? '[name].css' : 'css/[contenthash].css',
            img: ({ isDev }) => isDev ? '[path][name].[ext]' : 'img/[contenthash:7].[ext]',
            font: ({ isDev }) => isDev ? '[path][name].[ext]' : 'fonts/[contenthash:7].[ext]',
            video: ({ isDev }) => isDev ? '[path][name].[ext]' : 'videos/[contenthash:7].[ext]'
        },
        ...(!isDev && {
            //Отключаем для Development всю минификацию html, чтобы ускорить процесс разработки.
            html: {
                minify: {
                    collapseBooleanAttributes: true,
                    decodeEntities: true,
                    minifyCSS: true,
                    minifyJS: true,
                    processConditionalComments: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true,
                    trimCustomFragments: true,
                    useShortDoctype: true
                }
            }
        }),
        splitChunks: {
            //Разбиваем на независимые чанки всё приложение.
            layouts: true,
            pages: true,
            commons: true
        },
        optimization: {
            minimize: !isDev //Отключаем минификацию js для development.
        },
        ...(!isDev && {
            extractCSS: {
                //По умолчанию Nuxt автоматически добавляет все стили проекта прямо внутрь html через тег style. Это уменьшает количество запросов к серверу, так как у нас нигде не будет нужно браузеру загружать css файлы отдельно. Но это так же лишает браузер возможности кешировать css стили. Поэтому для development мы включаем inline styles, а в production разбиваем их на чанки для каждого компонента и создаем отдельные файлы.
                // ignoreOrder: true Нужно задать, чтобы во время сборки нам не выдавал webpack ложные предупреждения о найденных конфликтах и дубликатах
                ignoreOrder: true
            }
        }),
        transpile: ['vue-lazy-hydration', 'intersection-observer'], //По умолчанию Babel старается трансплитирировать весь код проекта, но иногда он не делает это с некоторыми зависимостями и их нужно задать явно.
        postcss: {
            //Nuxt из коробки имеет встроенный Postcss для которого здесь мы задаём конфиг. Здесь мы можем подключать полезные плагины для Postcss, задавать их порядок исполнения. В данном случае мы отключаем для development все плагины, а в production весь css будет минифицирован и к нему будут присвоены vendor префиксы для 99.5% браузеров. Так же мы можем прописать плагины, которые будут использоваться сразу в двух средах.
            plugins: {
                ...(!isDev && {
                    cssnano: {
                        preset: ['advanced', {
                            autoprefixer: false,
                            cssDeclarationSorter: false,
                            zindex: false,
                            discardComments: {
                                removeAll: true
                            }
                        }]
                    }
                })
            },
            ...(!isDev && {
                preset: {
                    browsers: 'cover 99.5%',
                    autoprefixer: true
                }
            }),

            order: 'cssnanoLast'
        },
        //Здесь мы можем изменять webpack конфиг, напрямую перехватывать нужные loaders или test.
        // По умолчанию Webpack '/\\.(png|jpe?g|gif|svg|webp)$/i' ищет все картинки и svg файлы и обрабатывает их через встроенный url-loader file-loader для того чтобы мы могли в компонентах импортировать эти файлы. Но он никаких их не сжимает и его возможности по работе с svg сильно ограничены. Поэтому мы изменим это поведение.
        extend (config, ctx) {
            //Создадим константы в которых будем хранить новые загрузчики и плагины Webpack, а так же строку для поиска встроенного загрузчика, чтобы позже её перехватить.
            const ORIGINAL_TEST = '/\\.(png|jpe?g|gif|svg|webp)$/i'
            const vueSvgLoader = [
                {
                    loader: 'vue-svg-loader',
                    options: {
                        svgo: false
                    }
                }
            ]
            const imageMinPlugin = new ImageminPlugin({
                pngquant: {
                    quality: '5-30',
                    speed: 7,
                    strip: true
                },
                jpegtran: {
                    progressive: true

                },
                gifsicle: {
                    interlaced: true
                },
                plugins: [
                    imageminMozjpeg({
                        quality: 70,
                        progressive: true
                    })

                ]
            })
            if (!ctx.isDev) config.plugins.push(imageMinPlugin) //Добавляем плагин для сжатия только в production


            //Перехватываем стандартный загрузчик и убираем из него svg
            config.module.rules.forEach(rule => {
                if (rule.test.toString() === ORIGINAL_TEST) {
                    rule.test = /\.(png|jpe?g|gif|webp)$/i
                    rule.use = [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 1000,
                                name: ctx.isDev ? '[path][name].[ext]' : 'img/[contenthash:7].[ext]'
                            }
                        }
                    ]
                }
            })
            //  Create the custom SVG rule
            const svgRule = {
                test: /\.svg$/,
                oneOf: [
                    {
                        resourceQuery: /inline/,
                        use: vueSvgLoader
                    },
                    {
                        resourceQuery: /data/,
                        loader: 'url-loader'
                    },
                    {
                        resourceQuery: /raw/,
                        loader: 'raw-loader'
                    },
                    {
                        loader: 'file-loader' // By default, always use file-loader
                    }
                ]
            }

            config.module.rules.push(svgRule) // Actually add the rule
        }
    }
}
