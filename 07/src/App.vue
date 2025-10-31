<template>
  <el-container style="height:100vh">
    <el-header>Header</el-header>
    <el-header style="font-size:24px; background-color: rgb(238, 241, 246)">Quiz后台管理</el-header>
    <el-container>
  <el-aside width="260px" style="background:#f5f7fa; padding:8px;">
        <div style="display:flex; align-items:center; justify-content:space-between; padding:6px 8px;">
          <div style="font-size:13px; color:#606266;">系统信息管理</div>
          <el-button type="text" :icon="menuCollapsed ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" @click="toggleMenu"></el-button>
        </div>

        <div :style="menuWrapperStyle">
          <el-menu class="el-menu-vertical-demo" router :default-active="$route.path" style="margin-top:8px; font-size:13px;">
            <el-menu-item index="/user">用户管理</el-menu-item>
            <el-menu-item index="/question">题目管理</el-menu-item>
          </el-menu>
        </div>
      </el-aside>

      <el-container>
        <el-main style="padding:24px;">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return { menuCollapsed: false }
  },
  computed: {
    menuWrapperStyle() {
      // animate collapse vertically using max-height transition
      return {
        overflow: 'hidden',
        maxHeight: this.menuCollapsed ? '0px' : '200px',
        transition: 'max-height 0.28s ease'
      }
    }
  },
  methods: {
    toggleMenu() { this.menuCollapsed = !this.menuCollapsed }
  }
}
</script>

<style>
html, body, #app { height: 100%; margin: 0; }
</style>
