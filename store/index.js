// function for Mock API
const sleep = m => new Promise(r => setTimeout(r, m)) //Функция, которая позволит нам симулировать задержку с сервера внутри Async функций
const categories = [
    {
        id: 'cats',
        cTitle: 'Котики',
        cName: 'Котики',
        cSlug: 'cats',
        cMetaDescription: 'Мета описание',
        cDesc: 'Описание',
        cImage: 'https://source.unsplash.com/300x300/?cat,cats',
        products: []
    },
    {
        id: 'dogs',
        cTitle: 'Собачки',
        cName: 'Собачки',
        cSlug: 'dogs',
        cMetaDescription: 'Мета описание',
        cDesc: 'Описание',
        cImage: 'https://source.unsplash.com/300x300/?dog,dogs',
        products: []
    },
    {
        id: 'wolfs',
        cTitle: 'Волчки',
        cName: 'Волчки',
        cSlug: 'wolfs',
        cMetaDescription: 'Мета описание',
        cDesc: 'Описание',
        cImage: 'https://source.unsplash.com/300x300/?wolf',
        products: []
    },
    {
        id: 'bulls',
        cTitle: 'Бычки',
        cName: 'Бычки',
        cSlug: 'bulls',
        cMetaDescription: 'Мета описание',
        cDesc: 'Описание',
        cImage: 'https://source.unsplash.com/300x300/?bull',
        products: []
    }
]

function addProductsToCategory (products, category) {
    const categoryInner = { ...category, products: []  }
    products.map(p => {
        if (p.category_id === category.id) {
            categoryInner.products.push({
                id: p.id,
                pName: p.pName,
                pSlug: p.pSlug,
                pPrice: p.pPrice,
                image: `https://source.unsplash.com/300x300/?${p.pName}`
            })
        }
    })
    return categoryInner
}

//Это наше глобальное состояние приложения. В нём мы прописываем дефолтные значения переменных.
export const state = () => ({
    categoriesList: [],
    currentCategory: {},
    currentProduct: {}
})
//Через функции, которые называются мутациями мы можем изменить состояние. Не рекомендуется менять его напрямую. Я намеренно опустил этап валидации и тд. поэтому всё сводится просто к присвоению переменной.
export const mutations = {
    SET_CATEGORIES_LIST (state, categories) {
        state.categoriesList = categories
    },
    SET_CURRENT_CATEGORY (state, category) {
        state.currentCategory = category
    },
   SET_CURRENT_PRODUCT (state, product) {
        state.currentProduct = product
   }

}
//Здесь будут наши actions, это тоже функции, но они не меняют напрямую состояние, но зато получают в качестве первого аргумента объект store из которого в данном случае нам нужна функция comit, которая получает в качестве первого аргумента имя мутации, а второго данные, которые она передаёт в мутацию. А в качестве второго аргумента action получает контекст Nuxt где мы можем обращаться к разным плагинам, например к тому же axios и работать через него с реальным API.
 //   По сути в actions будет проходить вся работа с API. Мы можем также вызывать другие actions, таким образом создавая цепочки. В данном случае мы симулируем работу с API, но в будущем можем заменить её на реальный API при этом на не придется переписывать код компонентов и страниц так как вся логика работы скрыта
export const actions = {
    async getCategoriesList ({ commit }) {
        try {
            await sleep(1000)
            await commit('SET_CATEGORIES_LIST', categories)
        } catch (err) {
            console.log(err)
            throw new Error('Внутреняя ошибка сервера, сообщите администратору')
        }
    },
    //в этом action на основании текущего route мы ищем нужную категорию и добавляем её в state.
    async getCurrentCategory({ commit }, { route }) {
        await sleep(1000)
        const category = categories.find(cat => cat.cSlug === route.params.CategorySlug)
        const products = await this.$axios.$get('/mock/products.json')

        await commit('SET_CURRENT_CATEGORY', addProductsToCategory(products, category))
    }

}
