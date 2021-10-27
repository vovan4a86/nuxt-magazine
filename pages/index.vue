<template>
  <div>
    <h1>Интернет-магазин</h1>
<!--    Выводим компонент, передавая ему в props объект categories-->
    <CategoriesList :categories="categories" />
  </div>
</template>

<script>
import CategoriesList from "~~/components/common/CategoriesList"; //Импортируем наш список категорий используя ~~, что означает абсолютный путь.
import { mapState } from 'vuex'; //Нам нужно получить глобальное состояние в котором храниться список категорий.

export default {
  components: {CategoriesList},
  //asyncData Это специальный метод, который вызывает Nuxt на сервере. В нём мы можем получить данные из API напрямую, но в данном случае, мы хотим их получить вызвав определённый action в Vuex. Так же перед функцией есть приставка async , что позволяет нам сказать Nuxt не рендерить страницу пока данные из API не получены.
  async asyncData ({ app, route, params, error, store }) {
    try {
      await store.dispatch('getCategoriesList')
    } catch (err) {
      console.log(err)
      return error({
        statusCode: 404,
        message: 'Категории не найдены или сервер не доступен'
      })
    }
  },
  computed: {
    ...mapState({
      categories: 'categoriesList' //Через обвертку получаем в страницу объект categories привязанный к глобальному состоянию categoriesList
    })
  }

}
</script>
