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
  let userId: number | null;
  let mainCred: {email: string, pass: string}

  test.beforeEach(async ({ page, request }) => {
    mainCred = AdminCredentials.admin
    loginPage = new LoginPage(page);
    adminPanelUsersPage = new AdminPanelUsersPage(page);
    teacherListPage = new TeacherListPage(page);
    teacherFormPage = new TeacherFormPage(page);
    teacherProfilePage = new TeacherProfilePage(page);
    teacher = UserDataGenerator.generateTeacher(true);
    apiHelper = await ApiHelper.create(request, "https://dev-api.fasted.space", mainCred.email, mainCred.pass);

  });

  test('Should create teacher password', async ({ page }) => {
    // Login
    await loginPage.open()
    await loginPage.login(mainCred.email, mainCred.pass);

    // Create teacher via api
    userId = await apiHelper.createTeacher(teacher);

    // Navigate to teacher list
    await adminPanelUsersPage.navigateToTeachersList();

    // Search teacher and verify details
    await teacherListPage.searchTeacherByEmail(teacher.email, teacher.subject);

    // Create teacher password

  });
  

  test.afterEach(async ({page}) => {
    // DELETE created teacher via API
    console.log(`Attempting to delete user. ID: ${userId}`);
    if(userId) {
      await apiHelper.deleteUser(userId);
      console.log(`Teacher with ID ${userId} deleted successfully.`)
    } else {
      console.warn('User ID is missing. Skipping deletion.');
    }
  });
});