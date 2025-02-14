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
    let token: string;
    let userId: number;

    test.beforeEach(async ({ page, request }) => {
        loginPage = new LoginPage(page);
        adminPanelUsersPage = new AdminPanelUsersPage(page);
        studentListPage = new StudentListPage(page);
        studentFormPage = new StudentFormPage(page);
        studentProfilePage = new StudentProfilePage(page);
        apiHelper = new ApiHelper(request, "http://dev-api.fasted.space");

        const mainCred = AdminCredentials.admin;
        student = UserDataGenerator.generateStudent();

        // Login as admin
        await loginPage.open();
        await loginPage.login(mainCred.email, mainCred.pass);
    });

    test('Should create test student', async () => {
        // Navigate to the admin panel
        await adminPanelUsersPage.navigateToStudentsList();
        await studentListPage.addNewStudentBtnClick();

        // Fill student form
        await studentFormPage.fillStudentForm(student);
        await studentFormPage.submitForm();

        // Search for the student in the list and check if the data is correct
        await studentListPage.searchStudentByEmail(student.email, student.telegram);

        await expect(studentProfilePage.getStudentImage()).toBeVisible();
        await expect(studentProfilePage.getStudentLastName()).toHaveText(student.lastName);
        await expect(studentProfilePage.getStudentFirstName()).toHaveText(student.firstName);
        await expect(studentProfilePage.getStudentSurname()).toHaveText(student.surname);
        await expect(studentProfilePage.getStudentDate()).toHaveText(student.date);
        await expect(studentProfilePage.getStudentEmail()).toHaveText(student.email);
        await expect(studentProfilePage.getStudentPhone()).toHaveText(student.phone);
        await expect(studentProfilePage.getStudentTelegram()).toHaveText(student.telegram);

        // Add teacher into test-teachers.json
        const studentsFilePath = 'test-students.json';
        const existingStudents = await fs.readFile(studentsFilePath, 'utf-8').catch(() => '[]');
        const students = JSON.parse(existingStudents);
        students.push(student);
        await fs.writeFile(studentsFilePath, JSON.stringify(students, null, 2));
        console.log(`User data saved to ${studentsFilePath}`);
    });

    test.afterEach(async () => {
        token = loginPage.accessToken;
        userId = studentFormPage.studentId;
    
        // DELETE created user via API
        console.log(`Attempting to delete user. ID: ${userId}, Token: ${token}`);
        if(userId && token) {
          const isDeleted = await apiHelper.deleteUser(userId, token);
          await expect(isDeleted).toBe(true);
          console.log(`Student with ID ${userId} deleted successfully.`)
        } else {
          console.warn('User ID or Token is missing. Skipping deletion.');
        }
      });
});