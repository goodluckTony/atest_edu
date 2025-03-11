import { test, expect } from '@playwright/test';
import { LoginPage } from '../pageobjects/LoginPage';
import { AdminPanelUsersPage } from '../pageobjects/AdminPanelUsersPage';
import { TeacherListPage } from '../pageobjects/TeacherListPage';
import { Gender, TeacherFormPage, CreateTeacherData } from '../pageobjects/TeacherFormPage';
import { TeacherProfilePage } from '../pageobjects/TeacherProfilePage';
import { TeacherEditProfilePage } from '../pageobjects/TeacherEditProfilePage';
import { AdminCredentials } from '../pageobjects/utils/AdminCredentials';
import { UserDataGenerator } from '../pageobjects/utils/UserDataGenerator';
import { ApiHelper } from "../pageobjects/utils/ApiHelper";
import { TeacherPanelEngPage } from '../pageobjects/TeacherPanelEngPage';

test.describe('Teacher setup', () => {
  let apiHelper: ApiHelper;
  let loginPage: LoginPage;
  let adminPanelUsersPage: AdminPanelUsersPage;
  let teacherListPage: TeacherListPage;
  let teacherFormPage: TeacherFormPage;
  let teacherProfilePage: TeacherProfilePage;
  let teacherEditProfilePage: TeacherEditProfilePage;
  let teacherPanelEngPage: TeacherPanelEngPage;
  let teacher;
  let userId: number | null;
  let mainCred: {email: string, pass: string}

  test.beforeEach(async ({ page, request }) => {
    loginPage = new LoginPage(page);
    adminPanelUsersPage = new AdminPanelUsersPage(page);
    teacherListPage = new TeacherListPage(page);
    teacherFormPage = new TeacherFormPage(page);
    teacherProfilePage = new TeacherProfilePage(page);
    teacherEditProfilePage = new TeacherEditProfilePage(page);
    teacherPanelEngPage = new TeacherPanelEngPage(page);
    mainCred = AdminCredentials.admin;
    teacher = UserDataGenerator.generateTeacher(true);
    apiHelper = await ApiHelper.create(request, "https://dev-api.fasted.space", mainCred.email, mainCred.pass);
  });

  test('Should setup existing teacher', async ({ page }) => {
    // Login as admin
    await loginPage.open()
    await loginPage.login(mainCred.email, mainCred.pass);

    // Create teacher via api
    userId = await apiHelper.createTeacher(teacher);
  
    // Navigate to teacher form
    await adminPanelUsersPage.navigateToTeachersList();

    // Search teacher and verify details
    await teacherListPage.searchTeacherByEmail(teacher.email, teacher.subject);

    // Nav to teachers study page
    await adminPanelUsersPage.navigateToTeachersStudy();

    // Setup teachers study
    await teacherPanelEngPage.setupTeacherStudy();

  });
  
  test.afterEach(async ({page}) => {
    // DELETE created teacher via API
    console.log(`Attempting to delete user. ID: ${userId}`);
    if(userId) {
      await apiHelper.deleteUser(userId);
      console.log(`Teacher with ID ${userId} deleted successfully.`)
    } else {
      console.warn('User ID or Token is missing. Skipping deletion.');
    }
  });
});