import { test, expect, request } from '@playwright/test';
import fs from 'fs/promises';
import { LoginPage } from '../pageobjects/LoginPage';
import { AdminPanelUsersPage } from '../pageobjects/AdminPanelUsersPage';
import { TeacherListPage } from '../pageobjects/TeacherListPage';
import { Gender, TeacherFormPage, CreateTeacherData } from '../pageobjects/TeacherFormPage';
import { TeacherProfilePage } from '../pageobjects/TeacherProfilePage';
import { AdminCredentials } from '../pageobjects/utils/AdminCredentials';
import { UserDataGenerator } from '../pageobjects/utils/UserDataGenerator';
import { ApiHelper } from "../pageobjects/utils/ApiHelper";

test.describe('User creation', () => {
  let loginPage: LoginPage;
  let adminPanelUsersPage: AdminPanelUsersPage;
  let teacherListPage: TeacherListPage;
  let teacherFormPage: TeacherFormPage;
  let teacherProfilePage: TeacherProfilePage;
  let teacher;
  let apiHelper: ApiHelper;
  let token: string;
  let userId: number;

  test.beforeEach(async ({ page, request }) => {
    loginPage = new LoginPage(page);
    adminPanelUsersPage = new AdminPanelUsersPage(page);
    teacherListPage = new TeacherListPage(page);
    teacherFormPage = new TeacherFormPage(page);
    teacherProfilePage = new TeacherProfilePage(page);
    apiHelper = new ApiHelper(request, "http://dev-api.fasted.space");
  });

  test('Should create test teacher', async ({ page, request }) => {
    // Generate random user data
    const mainCred = AdminCredentials.admin;
    teacher = UserDataGenerator.generateTeacher();

    // Login
    await loginPage.open()
    await loginPage.login(mainCred.email, mainCred.pass);

    // Navigate to teacher form
    await adminPanelUsersPage.navigateToTeachersList();
    await teacherListPage.addNewTeacherBtnClick();

    // Fill teacher form
    await teacherFormPage.fillTeacherForm(teacher);
    await teacherFormPage.submitForm();

    // Search teacher and verify details
    await teacherListPage.searchTeacherByEmail(teacher.email, teacher.subject);

    await expect(teacherProfilePage.getTeacherLastName()).toHaveText(teacher.lastName);
    await expect(teacherProfilePage.getTeacherFirstName()).toHaveText(teacher.firstName);
    await expect(teacherProfilePage.getTeacherSurname()).toHaveText(teacher.surname);
    await expect(teacherProfilePage.getTeacherDate()).toHaveText(teacher.date);
    await expect(teacherProfilePage.getTeacherGender()).toHaveText(teacher.gender === 1 ? "Чоловіча" : "Жіноча");
    await expect(teacherProfilePage.getTeacherEmail()).toHaveText(teacher.email);
    await expect(teacherProfilePage.getTeacherPhone()).toHaveText(teacher.phone);
    await expect(teacherProfilePage.getTeacherTelegram()).toHaveText(teacher.telegram);
    await expect(teacherProfilePage.getTeacherLink()).toHaveText(teacher.link);
    // await expect(teacherProfilePage.getTeacherLink()).toHaveText("asd");

    // Add teacher into test-teachers.json
    const usersFilePath = 'test-teachers.json';
    const existingUsers = await fs.readFile(usersFilePath, 'utf-8').catch(() => '[]');
    const users = JSON.parse(existingUsers);
    users.push(teacher);
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
    console.log(`User data saved to ${usersFilePath}`);
  });

  test.afterEach(async () => {
    token = loginPage.accessToken;
    userId = teacherFormPage.teacherId;

    // DELETE created teacher via API
    console.log(`Attempting to delete user. ID: ${userId}, Token: ${token}`);
    if(userId && token) {
      const isDeleted = await apiHelper.deleteUser(userId, token);
      await expect(isDeleted).toBe(true);
      console.log(`Teacher with ID ${userId} deleted successfully.`)
    } else {
      console.warn('User ID or Token is missing. Skipping deletion.');
    }
  });
});