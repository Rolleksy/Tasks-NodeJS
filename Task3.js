const bankAccount = {
    balance: 1000,
    // getter
    get formattedBalance() {
      return `$${this.balance}`;
    },
    // setter
    set _balance(newBalance) {
      this.balance = newBalance;
      this.updateFormattedBalance();
    },
    // method to format balance
    updateFormattedBalance() {
      Object.defineProperty(this, 'formattedBalance', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: `$${this.balance}`
      });
    },

    transfer(targetAccount, sourceAccount, amount) {
      if (sourceAccount.balance < amount) {
        console.log("Insufficient funds.");
        return;
      }
  
      sourceAccount.balance -= amount;
      targetAccount.balance += amount;
  
      sourceAccount.updateFormattedBalance();
      targetAccount.updateFormattedBalance();
  
      console.log(`Transferred $${amount} from ${sourceAccount.formattedBalance} to ${targetAccount.formattedBalance}.`);
    }
  };
  
  // Test
  console.log("Source account");
  console.log("Current balance:", bankAccount.formattedBalance);
  
  bankAccount.balance = 1500; // using setter to update balance
  console.log("Updated balance:", bankAccount.formattedBalance);
  
  let targetAccount = Object.create(bankAccount);
  targetAccount.balance = 500;

 
  console.log("Target account");
  console.log("Current balance:", targetAccount.formattedBalance);
  bankAccount.transfer(targetAccount, bankAccount, 300); 
  console.log("bankAccount:", bankAccount.formattedBalance);
  console.log("targetAccount:", targetAccount.formattedBalance);
  