<template>
  <div>
    <el-row :gutter="12" class="mb-3" type="flex" align="middle">
      <el-col>
        <el-input v-model="query" placeholder="题目关键字" clearable @clear="search" style="width:360px; margin-right:8px;"></el-input>
        <el-button type="success" @click="search" style="margin-right:6px;">查询题目</el-button>
        <el-button type="success" @click="addQuestion">添加题目</el-button>
      </el-col>
    </el-row>

    <!-- Add Question Dialog -->
    <el-dialog title="添加题目" :visible.sync="showAddQuestionDialog" width="600px">
      <el-form label-position="top">
        <el-form-item label="问题内容">
          <el-input type="textarea" v-model="newQuestion.question" rows="3"></el-input>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="选项 A">
              <el-input v-model="newQuestion.options.A"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选项 B">
              <el-input v-model="newQuestion.options.B"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="选项 C">
              <el-input v-model="newQuestion.options.C"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选项 D">
              <el-input v-model="newQuestion.options.D"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="答案">
          <el-radio-group v-model="newQuestion.answer">
            <el-radio label="A">A</el-radio>
            <el-radio label="B">B</el-radio>
            <el-radio label="C">C</el-radio>
            <el-radio label="D">D</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddQuestionDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmAddQuestion">确定</el-button>
      </span>
    </el-dialog>

    <el-table :data="pagedData" stripe style="width:100%">
      <el-table-column label="序号" width="80">
        <template slot-scope="scope">{{ scope.$index + 1 + (page-1)*perPage }}</template>
      </el-table-column>
      <el-table-column prop="question" label="问题" />
      <el-table-column label="选项">
        <template slot-scope="scope">{{ scope.row.options.join(',') }}</template>
      </el-table-column>
      <el-table-column prop="answer" label="答案" width="120" />
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
  name: 'QuestionView',
  data() {
    return {
      query: '',
      page: 1,
      perPage: 5,
      questions: [],
      showAddQuestionDialog: false,
      newQuestion: { question: '', options: { A: '', B: '', C: '', D: '' }, answer: 'A' }
    }
  },
  computed: {
    filtered() { if (!this.query) return this.questions; return this.questions.filter(q => q.question.includes(this.query)) },
    pagedData() { const start = (this.page-1)*this.perPage; return this.filtered.slice(start, start+this.perPage) }
  },
  methods: {
    search() { this.page = 1 },
    addQuestion() {
      this.newQuestion = { question: '', options: { A: '', B: '', C: '', D: '' }, answer: 'A' }
      this.showAddQuestionDialog = true
    },
    confirmAddQuestion() {
      const q = this.newQuestion
      if (!q.question.trim()) { this.$message.error('问题内容不能为空'); return }
      const opts = [q.options.A, q.options.B, q.options.C, q.options.D]
      if (opts.some(o => !o || !o.trim())) { this.$message.error('所有选项不能为空'); return }
      const answerIndex = { A:0, B:1, C:2, D:3 }[q.answer]
      this.questions.unshift({ question: q.question, options: opts, answer: opts[answerIndex] })
      this.showAddQuestionDialog = false
      this.$message.success('添加成功')
    },
    edit(q) { this.$prompt('编辑问题', '编辑', { inputValue: q.question }).then(({ value })=> q.question = value).catch(()=>{}) },
    remove(q) { this.$confirm('确认删除该题目？', '提示', { confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning' }).then(()=> this.questions = this.questions.filter(x=>x!==q)).catch(()=>{}) },
    onPageChange(p) { this.page = p },
    seed() { this.questions = []; for (let i=0;i<17;i++) this.questions.push({ question: '法国的首都是是什么？', options: ['巴黎','里昂','尼斯','马赛'], answer: '巴黎' }) }
  },
  mounted() { this.seed() }
}
</script>

<style scoped>
</style>
