import { test, expect } from '@playwright/test';
import fs from 'fs/promises';
import { LoginPage } from '../pageobjects/LoginPage';
import { AdminPanelUsersPage } from '../pageobjects/AdminPanelUsersPage';
import { StudentListPage } from '../pageobjects/StudentListPage';
import { StudentFormPage } from '../pageobjects/StudentFormPage';
import { StudentProfilePage } from '../pageobjects/StudentProfilePage';
import { AdminCredentials } from '../pageobjects/utils/AdminCredentials';
import { UserDataGenerator } from '../pageobjects/utils/UserDataGenerator';
import { ApiHelper } from "../pageobjects/utils/ApiHelper";

test.describe("Student creation", () => {
  let loginPage: LoginPage;
  let adminPanelUsersPage: AdminPanelUsersPage;
  let studentListPage: StudentListPage;
  let studentFormPage: StudentFormPage;
  let studentProfilePage: StudentProfilePage;
  let student;
  let apiHelper: ApiHelper;
  let userId: number | null;
  let mainCred: {email: string, pass: string};

  test.beforeEach(async ({ page, request }) => {
    mainCred = AdminCredentials.admin;
    loginPage = new LoginPage(page);
    adminPanelUsersPage = new AdminPanelUsersPage(page);
    studentListPage = new StudentListPage(page);
    studentFormPage = new StudentFormPage(page);
    studentProfilePage = new StudentProfilePage(page);
    student = UserDataGenerator.generateStudent(true);
    apiHelper = await ApiHelper.create(request, "https://dev-api.fasted.space", mainCred.email, mainCred.pass);
      
  });
    
  test('Should create student password', async () => {
    // Login as admin
    await loginPage.open();
    await loginPage.login(mainCred.email, mainCred.pass);

    // Create student via api
    userId = await apiHelper.createStudent(student);

    // Navigate to the admin panel
    await adminPanelUsersPage.navigateToStudentsList();

    // Search for the student in the list and check if the data is correct
    await studentListPage.searchApiStudentByEmail(student.email, student.telegram);

    // Create teacher password
    expect(true).toBe(false);

  });

  test.afterEach(async () => {
    // DELETE created user via API
    console.log(`Attempting to delete user. ID: ${userId}`);
    if(userId) {
      await apiHelper.deleteUser(userId);
      console.log(`Student with ID ${userId} deleted successfully.`)
    } else {
      console.warn('User ID or Token is missing. Skipping deletion.');
    }
  });
});