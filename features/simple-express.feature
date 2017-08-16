Feature: Checking deployment
  As an devOps engineer
  I want see the welcome to page of express
  So that i know my POC is successful
  
  Scenario: See welcome to express page
    When I go to the just deployed test server
    Then I should see the welcome to page
