<!--Название файла должно начинаться с _, чтобы Nuxt понял, что это динамический маршрут.-->
<!--Когда мы переходим на страницу http://127.0.0.1:3000/category/cats-->
<!--Мы можем обратиться к объекту route таким образом route.params.CategorySlug (без нижнего подчеркивания), которое будет равным cats-->
<template>
  <div>
    <h1>{{ category.cName }}</h1>
    <p>{{ category.cDesc }}</p>
    <div :class="$style.productList">
      <div
        v-for="product in category.products"
        :key="product.id"
      >
        <ProductBrief :product="product" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ProductBrief from "~~/components/category/ProductBrief";

export default {
  components: {ProductBrief},
  async asyncData ({ app, route, params, error }) {
    try {
      await app.store.dispatch('getCurrentCategory', { route }) //Мы вызываем actions, вторым аргументам передаём вышеупомянутый объект route.
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
      category: 'currentCategory'
    })
  },
  head () {
    return {
      //Прописываем для этой страницы Title и Meta description, которые мы получаем из API.
      title: this.category.cTitle,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.category.cMetaDescription
        }
      ]
    }
  }
}
</script>

<style lang="scss" module>
.productList {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
