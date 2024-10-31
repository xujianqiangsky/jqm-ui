<script setup lang="ts">
import { listUserDetails, saveUser } from '@/api/core/user';
import { ref, onMounted } from 'vue';
import { listDepts } from '@/api/core/dept';

const page = ref<IPage<User>>();
const pageNum = ref(1);
const pageSize = ref(100);
const pageSizes = ref([100, 200, 300]);
const userFormVisible = ref(false);
const user = ref<User>({});
const confirmPassword = ref('');
const depts = ref<Array<Dept>>();

onMounted(async () => {
  const response = await listUserDetails(pageNum.value, pageSize.value);
  page.value = response.data.data;
});

const handleCurrentChange = async (num: number) => {
  const response = await listUserDetails(num, pageSize.value);
  page.value = response.data.data;
};

const handlePageSize = async (size: number) => {
  const response = await listUserDetails(pageNum.value, size);
  page.value = response.data.data;
};

async function addUser() {
  userFormVisible.value = true;
  const { data } = await listDepts();
  depts.value = data.data;
}

function cancel() {
  userFormVisible.value = false;
  user.value = {};
}

async function submitForm() {
  userFormVisible.value = false;
  await saveUser(user.value);
  ElNotification.success({ message: '保存用户信息成功' });
}
</script>

<template>
  <div class="user-container">
    <div class="user-table">
      <el-button type="primary" @click="addUser">新增用户</el-button>
      <el-table :data="page?.records" border>
        <el-table-column label="序号">
          <template #default="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="120" show-overflow-tooltip />
        <el-table-column prop="name" label="姓名" width="120" show-overflow-tooltip />
        <el-table-column label="头像">
          <template #default="scope">
            <el-avatar :src="scope.row.avatar" />
          </template>
        </el-table-column>
        <el-table-column prop="dept.name" label="部门名称" />
        <el-table-column label="性别">
          <template #default="scope">
            <span v-if="scope.row.gender === 0">男</span>
            <span v-else-if="scope.row.gender === 1">女</span>
            <span v-else>未知</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobileNumber" label="手机号码" width="120" />
        <el-table-column prop="email" label="邮箱" width="160" show-overflow-tooltip />
        <el-table-column label="账号状态">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 0">正常</el-tag>
            <el-tag v-else-if="scope.row.status === 1" type="danger">锁定</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdBy" label="创建人" />
        <el-table-column prop="createdTime" label="创建时间" width="160" />
      </el-table>
      <el-pagination
        class="pagination"
        v-model:current-page="pageNum"
        @update:current-page="handleCurrentChange"
        v-model:page-size="pageSize"
        @update:page-size="handlePageSize"
        :page-sizes="pageSizes"
        background
        layout="sizes, total, prev, pager, next"
        :total="page?.total"
        :page-count="page?.pages ?? 1" />
    </div>

    <el-dialog v-model="userFormVisible" title="新增用户" :close-on-click-modal="false">
      <el-form :model="user" label-width="auto">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="user.name" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="user.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="confirmPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="user.gender">
            <el-radio value="0">男</el-radio>
            <el-radio value="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobileNumber">
          <el-input v-model="user.mobileNumber" />
        </el-form-item>
        <el-form-item label="用户头像" prop="avatar">
          <el-input v-model="user.avatar" />
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="user.email" />
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
          <el-select v-model="user.deptId">
            <template v-for="dept in depts" :key="dept.id">
              <el-option :label="dept.name" :value="dept.id" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="账号状态" prop="status">
          <el-switch
            v-model="user.status"
            inline-prompt
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            active-text="正常"
            inactive-text="锁定"
            active-value="0"
            inactive-value="1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submitForm">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.user-container {
  --el-bg-color: var(--jqm-main-bg-color);

  margin: 1em;
  padding: 1em;
  border-radius: var(--el-border-radius-base);
  background-color: var(--jqm-main-bg-color);
}
.user-table > * + * {
  margin-top: 1em;
}
</style>
