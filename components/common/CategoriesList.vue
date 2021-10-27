<template>
  <div>
    <h2>Список категорий</h2>
    <div :class="$style.wrapper">
      <div
          v-for="category in categories"
          :key="category.cSlug"
          :class="$style.block"
      >
        <nuxt-link :to="`/category/${category.cSlug}`">
          <p>{{ category.cName }}</p>
          <img :src="category.cImage" />
        </nuxt-link>
<!--        Nuxt-link это встроенная обвёртка вокруг <router-link> , которая берёт на себя переходы между страницами, а так же имеет дополнительные функции, которые мы отключили ранее (предзагрузка страницы, когда эта ссылка появится в области видимости.-->
<!--        Мы передаём в атрибут to строковый литерал с переменной cSlug в конце, в которой у нас будут храниться уникальные пути к каждой категории.-->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  //Компонент будет получать данные из родительского, это позволит сделать его dump (глупым) и уменьшает сложность приложения. То есть он не работает с API или глобальным состоянием.
  props: {
    categories: {
      type: Array,
      default: () => []
    }
  }
}
</script>


<!--Для примера будем использовать относительно новую функцию CSS Modules, которая идёт из коробки и превращает например класс wrapper в wrapper_26mY3 , что позволяет вам не задумывать об именовании локальных классов в стилях компонентов.-->
<!--К классам придётся обращаться через объект $style в данном случае.-->
<style lang="scss" module>
.wrapper {
  display: flex;
}
.block {
  display: flex;
  flex-direction: column;
}
</style>
