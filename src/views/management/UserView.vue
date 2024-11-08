<script setup lang="ts">
import { Icon } from '@iconify/vue';
import {
  changeUserStatus,
  editUserById,
  getUserById,
  listUserDetails,
  removeUserById,
  saveUser
} from '@/api/core/user';
import { ref, onMounted } from 'vue';
import { listDepts } from '@/api/core/dept';
import { presignedByAvatar } from '@/api/core/oss';
import type { UploadRawFile, UploadUserFile } from 'element-plus';

const page = ref<IPage<User>>();
const pageNum = ref(1);
const pageSize = ref(100);
const pageSizes = ref([100, 200, 300]);
const userFormVisible = ref(false);
const userFormTitle = ref('');
const user = ref<User>({});
const depts = ref<Array<Dept>>();
const extraData = ref<Presigned>();
const fileList = ref<UploadUserFile[]>([]);

async function getData(pageNum: number, pageSize: number) {
  const response = await listUserDetails(pageNum, pageSize);
  page.value = response.data.data;
}

async function handleCurrentChange(num: number) {
  await getData(num, pageSize.value);
}

async function handlePageSize(size: number) {
  await getData(pageNum.value, size);
}

async function addUser() {
  userFormTitle.value = '新增用户';
  const { data } = await listDepts();
  depts.value = data.data;
  userFormVisible.value = true;
}

async function editUser(id: string) {
  userFormTitle.value = '修改用户';
  const deptsResult = await listDepts();
  depts.value = deptsResult.data.data;
  userFormVisible.value = true;
  const { data } = await getUserById(id);
  user.value = data.data;
  console.log(user);
}

function removeUser(user: User) {
  ElMessageBox.confirm(`确定删除用户【${user.username}】?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await removeUserById(user.id ?? '');
    await getData(pageNum.value, pageSize.value);
    ElMessage.success(`成功删除用户【${user.username}】`);
  });
}

function handleUserFormCloseEvent() {
  user.value = {};
}

function cancel() {
  userFormVisible.value = false;
}

async function submitForm() {
  userFormVisible.value = false;
  if (userFormTitle.value === '新增用户') {
    await saveUser(user.value);
    await getData(Math.floor(page.value!.total / (page.value!.size + 1)) + 1, pageSize.value);
    ElMessage.success('保存用户信息成功');
  }

  if (userFormTitle.value === '修改用户') {
    await editUserById(user.value);
    await getData(pageNum.value, pageSize.value);
    ElMessage.success('修改用户信息成功');
  }
}

async function beforeAvatarUpload(rawFile: UploadRawFile) {
  console.log(rawFile);
  const { data } = await presignedByAvatar(rawFile.name);
  extraData.value = { ...data.data };
  extraData.value['Content-Type'] = rawFile.type;
}

function handleAvatarSuccess() {
  user.value.avatar = `http://oss.jqm.plus/jqm/${extraData.value?.key}`;
}

async function handleUserStatusChangeEvent(id: string, status: number) {
  await changeUserStatus(id, status);
  ElMessage.success('修改用户账号状态成功');
}

onMounted(async () => {
  getData(pageNum.value, pageSize.value);
});
</script>

<template>
  <div class="user-container">
    <div class="user-table">
      <el-button type="primary" @click="addUser">新增用户</el-button>
      <el-table :data="page?.records" border stripe max-height="450">
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
            <!-- <el-tag v-if="scope.row.status === 0">正常</el-tag>
            <el-tag v-else-if="scope.row.status === 1" type="danger">锁定</el-tag> -->
            <el-switch
              v-model="scope.row.status"
              inline-prompt
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              active-text="正常"
              inactive-text="锁定"
              :active-value="0"
              :inactive-value="1"
              @change="handleUserStatusChangeEvent(scope.row.id, scope.row.status)" />
          </template>
        </el-table-column>
        <el-table-column prop="createdBy" label="创建人" />
        <el-table-column prop="createdTime" label="创建时间" width="160" />
        <el-table-column label="操作" fixed="right">
          <template #default="scope">
            <el-button @click="editUser(scope.row.id)" link><icon icon="ep:edit" /></el-button>
            <el-button @click="removeUser(scope.row)" type="danger" link
              ><icon icon="ep:delete"
            /></el-button>
          </template>
        </el-table-column>
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

    <el-dialog
      v-model="userFormVisible"
      :title="userFormTitle"
      :close-on-click-modal="false"
      @close="handleUserFormCloseEvent">
      <el-form :model="user" label-width="auto">
        <el-form-item label="用户名" prop="username" required>
          <el-input v-model="user.username" :disabled="userFormTitle === '修改用户'" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="user.name" />
        </el-form-item>
        <el-form-item v-if="userFormTitle === '新增用户'" label="密码" prop="password" required>
          <el-input v-model="user.password" type="password" show-password />
        </el-form-item>
        <el-form-item
          v-if="userFormTitle === '新增用户'"
          label="确认密码"
          prop="confirmPassword"
          required>
          <el-input v-model="user.confirmPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="手机号码" prop="mobileNumber">
          <el-input v-model="user.mobileNumber" />
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
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="user.gender">
            <el-radio :value="0">男</el-radio>
            <el-radio :value="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="账号状态" prop="status">
          <el-switch
            v-model="user.status"
            inline-prompt
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            active-text="正常"
            inactive-text="锁定"
            :active-value="0"
            :inactive-value="1" />
        </el-form-item>
        <el-form-item v-if="userFormTitle === '新增用户'" label="用户头像" prop="avatar">
          <el-upload
            action="http://oss.jqm.plus/jqm"
            v-model:file-list="fileList"
            list-type="picture-card"
            limit="1"
            accept="image/*"
            :data="extraData"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <icon icon="ep:plus" />
          </el-upload>
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
