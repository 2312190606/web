<template>
  <div>
    <el-row :gutter="12" class="mb-3" type="flex" align="middle">
      <el-col>
        <el-input v-model="query" placeholder="用户名" clearable @clear="search" style="width:360px; margin-right:8px;"></el-input>
        <el-button type="success" @click="search" style="margin-right:6px;">查询用户</el-button>
        <el-button type="success" @click="addUser">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- Add User Dialog -->
    <el-dialog title="添加用户" :visible.sync="showAddUserDialog">
      <el-form label-position="top">
        <el-form-item label="用户名">
          <el-input v-model="newUser.name"></el-input>
        </el-form-item>
        <el-form-item label="初始密码">
          <el-input type="password" v-model="newUser.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input type="password" v-model="newUser.confirm"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddUserDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmAddUser">确定</el-button>
      </span>
    </el-dialog>

    <el-table :data="pagedData" stripe style="width:100%">
      <el-table-column label="日期" width="160">
        <template slot-scope="scope">
          <i class="el-icon-time" style="margin-right:6px;color:#909399"></i>
          {{ scope.row.date }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="用户名">
        <template slot-scope="scope">
          <el-tag class="username-tag">{{ scope.row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="password" label="密码" width="160" />
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="mt-3 text-center">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="perPage"
        :current-page.sync="page"
        :total="filtered.length"
        prev-text="‹"
        next-text="›"
        @current-change="onPageChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserView',
  data() {
    return {
      query: '',
      page: 1,
      perPage: 5,
      users: [],
      showAddUserDialog: false,
      newUser: { name: '', password: '', confirm: '' }
    }
  },
  computed: {
    filtered() {
      if (!this.query) return this.users
      return this.users.filter(u => u.name.includes(this.query))
    },
    pagedData() {
      const start = (this.page - 1) * this.perPage
      return this.filtered.slice(start, start + this.perPage)
    }
  },
  methods: {
    search() { this.page = 1 },
    addUser() {
      this.newUser = { name: '', password: '', confirm: '' }
      this.showAddUserDialog = true
    },
    confirmAddUser() {
      const { name, password, confirm } = this.newUser
      if (!name || !password) {
        this.$message.error('用户名和密码不能为空')
        return
      }
      if (password !== confirm) {
        this.$message.error('两次输入的密码不一致')
        return
      }
      this.users.unshift({ date: new Date().toISOString().slice(0,10), name, password })
      this.showAddUserDialog = false
      this.$message.success('添加成功')
    },
    edit(u) {
      this.$prompt('编辑用户名', '编辑', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: u.name
      }).then(({ value }) => { u.name = value }).catch(()=>{})
    },
    remove(u) {
      this.$confirm('确认删除该用户？', '提示', { confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning' })
        .then(()=>{ this.users = this.users.filter(x=>x!==u) })
        .catch(()=>{})
    },
    onPageChange(p) { this.page = p },
    seed() {
      this.users = []
      for (let i=0;i<23;i++) {
        this.users.push({date: `2016-05-${(i%30+1).toString().padStart(2,'0')}`, name: '王小虎', password: '123456'})
      }
    }
  },
  mounted() { this.seed() }
}
</script>

<style scoped>
 .username-tag {
   background: #e6f7ff;
   color: #1890ff;
   border: none;
 }
</style>

