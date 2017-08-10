#!groovy​

import groovy.json.JsonSlurperClassic


@NonCPS
def jsonParse(def json) {
    new groovy.json.JsonSlurperClassic().parseText(json)
}

def notifyBuild(String buildStatus = 'STARTED') {
    // build status of null means successful
    buildStatus = buildStatus ?: 'SUCCESSFUL'
    // Default values
    def changes = getChangeString()
    def subject = "${buildStatus}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'"
    def summary = "${subject} (${env.BUILD_URL})"
    def details = """<p>STARTED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
    <p>Check console output at &QUOT;<a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a>&QUOT;</p>
    ${changes}"""
    emailext(
            subject: subject,
            body: details,
            recipientProviders: [[$class: 'DevelopersRecipientProvider']],
            to: 'kris.barnhoorn@gmail.com'
    )
}

def getChangeString() {
    MAX_MSG_LEN = 100
    def changeString = ""
    echo "Gathering SCM changes"
    def changeLogSets = currentBuild.rawBuild.changeSets
    for (int i = 0; i < changeLogSets.size(); i++) {
        def entries = changeLogSets[i].items
        for (int j = 0; j < entries.length; j++) {
            def entry = entries[j]
            truncated_msg = entry.msg.take(MAX_MSG_LEN)
            changeString += "<p> - ${truncated_msg} [${entry.author}]\n</p>"
        }
    }
    if (!changeString) {
        changeString = " - No new changes"
    }
    return changeString
}


def version;
def majorVersion;
def buildNumber;


def checkoutDeploymentCode() {
    dir('deployment') {
        checkout poll: false, scm: [
                $class                : 'SubversionSCM',
                additionalCredentials : [],
                excludedCommitMessages: '',
                excludedRegions       : '',
                excludedRevprop       : '',
                excludedUsers         : '',
                filterChangelog       : false,
                ignoreDirPropChanges  : false,
                includedRegions       : '',
                locations             : [[
                                                 credentialsId        : 'afdef318-38f8-486d-8f66-6c61fd327208',
                                                 depthOption          : 'infinity',
                                                 ignoreExternalsOption: true,
                                                 local                : '.',
                                                 remote               : 'http://vm-srv083:8082/svn/did/salesportal-deployment/trunk']],
                workspaceUpdater      : [$class: 'UpdateUpdater']]
    }
}

def checkoutDevopsTools() {
    dir('devops-tools') {
        git url: 'http://vm-srv270:7990/scm/did/devops-tools.git'
    }
}

node() {
    checkout scm
    def config = jsonParse(readFile("app/package.json"))
    //replace with def props = readJSON file: 'salesportal-client/package.json'
    version = config["version"]
    def pos = version.lastIndexOf(".")
    majorVersion = version.substring(0, pos)
    //def revisionNumber = sh(returnStdout: true, script: 'git rev-list --count HEAD')
    //buildNumber = version + "-r" + revisionNumber
    //VersionNumber "${buildNumber}"
    //currentBuild.displayName = buildNumber
    //echo "Pipeline type is ${pipelineType}"
    //echo "Branch is ${env.BRANCH_NAME}"
    //echo "Version is ${version}"
    //echo "MajorVersion is ${majorVersion}"
    //echo "buildNumber is ${buildNumber}"

    stage('Build') {
        try {
            //notifyBuild('STARTED')
            sh 'npm install'
        } catch (e) {
            // If there was an exception thrown, the build failed
            currentBuild.result = "FAILED"
            throw e
        } finally {
            // Success or failure, always send notifications
            //notifyBuild(currentBuild.result)
        }

    }

    stage('Code Quality') {
        try {
            echo "Running API tests ..."
        } catch (e) {
            //continue with the stages
        }
    }
}
stage('Functional Tests') {
    milestone()
    // use or create test server
    node('windows') {
        checkout scm
        bat 'npm install'
        bat 'grunt'
    }
    //destroy test server
}
def intEnv = "INT 1"

stage("Deploy $intEnv") {
    milestone()
    timeout(time: 5, unit: 'DAYS') {
        input "About to deploy on $intEnv. Are you sure?"
    }
    echo 'Deploying...'
}

def acceptanceEnv = "UAT"
stage("Deploy $acceptanceEnv") {
    milestone()
    timeout(time: 5, unit: 'DAYS') {
        input "About to deploy on $acceptanceEnv. Are you sure?"
    }
    node() {
        echo 'Deploying...'
    }
}
stage('Deploy PRD') {
    milestone()
    timeout(time: 5, unit: 'DAYS') {
        input 'About to deploy on PRD. Are you sure?'
    }
    node() {
        echo 'Deploying...'
    }
}


