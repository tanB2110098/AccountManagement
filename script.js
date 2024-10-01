class Account {
    constructor(id,email,tiktokAccount, date) {
        this.id = id;
        this.email = email;
        this.tiktokAccount = tiktokAccount;
        this.date = date;
    }
}

class AccountManagement {
    constructor(accounts) {
        this.accounts = accounts;
    }

    addAccount(account) {
        // check existing account
        for (let i = 0; i < this.accounts.length; i++) {
            if (this.accounts[i].email == account.email || this.accounts[i].tiktokAccount == account.tiktokAccount){
                alert("Account is already existing!");
                return;
            }
        }

        this.accounts.push(account);
        this.displayAccount();
        alert("Add account successfully!!");
    }

    printAccount() {
        console.log(accounts);
    }
    displayAccount() {
        // sort before display
        this.sortByActive();
        console.log(this.accounts);

        let accountBody = document.querySelector("#account-body");
        let html = '';
        for (let i = 0; i < this.accounts.length; i++) {
            let days = calculateDateDifference(new Date(), new Date(this.accounts[i].date));
            html += `<tr class="account-item">
                        <td class="account-item_info">${this.accounts[i].email}</td>
                        <td class="account-item_info">${this.accounts[i].tiktokAccount}</td>  
                        <td class="account-item_info">${days} days</td>  
                        <td class="account-item_info" >
                            <button id="remove" onclick="removeAccount(${this.accounts[i].id})">remove</button>
                            <button id="reset" onclick="resetAccount(${this.accounts[i].id})">Reset</button>
                        </td>  
                    </tr>`
        }
        accountBody.innerHTML = html;
    }

    saveAccount() {
        this.accounts = JSON.stringify(this.accounts);
        localStorage.setItem("accounts", this.accounts);
    }

    remove(id) {
        for (let i = 0; i < this.accounts.length; i++) {
            if (this.accounts[i].id == id) {
                this.accounts.splice(i, 1);
                this.displayAccount();
                saveAccounts(this.accounts);
                break;
            }
        }
         
        if (this.accounts.length == 0) {
            localStorage.removeItem("accounts");
        }
    }

    reset(id) {
        for (let i = 0; i < this.accounts.length; i++) {
            if (this.accounts[i].id == id) {
                this.accounts[i].date = Date.now();
                this.displayAccount();
                saveAccounts(this.accounts);
                break;
            }
        }
    }

    sortByActive() {
        let t;
        for (let i = 0; i < this.accounts.length - 1; i++) {
            for(let j = i + 1; j < this.accounts.length; j++) {
                let thisAccountDate = this.accounts[i].date;
                let thatAccountDate = this.accounts[j].date;
                if (thisAccountDate > thatAccountDate) {
                    t = this.accounts[i];
                    this.accounts[i] = this.accounts[j];
                    this.accounts[j] = t;
                }
            }
        }
        return this.accounts;

    }
}


function calculateDateDifference(date1, date2) {
    // Convert both dates to milliseconds
    const date1Millis = new Date(date1).getTime();
    const date2Millis = new Date(date2).getTime();

    // Find the difference in milliseconds
    const differenceMillis = Math.abs(date2Millis - date1Millis);

    // Convert the difference from milliseconds to days
    const differenceDays = Math.floor(differenceMillis / (1000 * 60 * 60 * 24));

    return differenceDays;
}


function getAccounts() {
    let accounts = localStorage.getItem("accounts");
    if (accounts == null) {
        accounts = [];
    } else {
        accounts = JSON.parse(accounts);
    }
    return accounts;

}

function addAccount() {
 
    let accounts = getAccounts()

    let accountManagement = new AccountManagement(accounts);
        
    let account = getAccountInput();
    accountManagement.addAccount(account);
    
    accountManagement.saveAccount();
}

function getAccountInput() {
    
    let id = Date.now();
    let email = document.querySelector("#email-input").value;
    let tiktok = document.querySelector("#tiktok-input").value;

    if (email =='' || tiktok =='') {
        alert("Please enter info!!");
        return;
    }
    let date = Date.now();
    let account = new Account(id,email, tiktok, date);

    return account;
}

function removeAccount(id) {
    let accounts = getAccounts();

    let accountManagement = new AccountManagement(accounts);

    accountManagement.remove(id);
}

function resetAccount(id) {
    let accounts = getAccounts();

    let accountManagement = new AccountManagement(accounts);

    accountManagement.reset(id);
    accountManagement.displayAccount();
    alert("Reset successfully")
}

function saveAccounts(accounts) {
    if (accounts.length != 0) {
        accounts = JSON.stringify(accounts);
        localStorage.setItem("accounts", accounts);
    }
}

function start() {
    let accounts = getAccounts();

    let accountManagement = new AccountManagement(accounts);
    accountManagement.displayAccount();

    // get account and display it 
    let account = localStorage.getItem("accounts");
    document.querySelector("#account").innerHTML = account;

    const buttonCopy = document.querySelector('#copy-account-btn');
    let accountList = document.querySelector("#account").textContent;
    buttonCopy.onclick = function() {
        navigator.clipboard.writeText(accountList)
                .then(() => {
                    console.log("JSON copied to clipboard");
                })
                .catch(err => {
                    console.error("Failed to copy JSON: ", err);
                });
    }
}

// copy account
function handleCopy(event) {
    console.log("có vào đây")
    // Modify the clipboard data
    event.clipboardData.setData('text/plain', 'You just copied custom text!');
    // Prevent the default copy action
    event.preventDefault();
    alert('Text copied!');
}


// end copy account

start();