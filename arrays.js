
const clients = [
  { id: 1, taxNumber: '86620855', name: 'HECTOR ACUÑA BOLAÑOS' },
  { id: 2, taxNumber: '7317855K', name: 'JESUS RODRIGUEZ ALVAREZ' },
  { id: 3, taxNumber: '73826497', name: 'ANDRES NADAL MOLINA' },
  { id: 4, taxNumber: '88587715', name: 'SALVADOR ARNEDO MANRIQUEZ' },
  { id: 5, taxNumber: '94020190', name: 'VICTOR MANUEL ROJAS LUCAS' },
  { id: 6, taxNumber: '99804238', name: 'MOHAMED FERRE SAMPER' }
];
const accounts = [
  { clientId: 6, bankId: 1, balance: 15000 },
  { clientId: 1, bankId: 3, balance: 18000 },
  { clientId: 5, bankId: 3, balance: 135000 },
  { clientId: 2, bankId: 2, balance: 5600 },
  { clientId: 3, bankId: 1, balance: 23000 },
  { clientId: 5, bankId: 2, balance: 15000 },
  { clientId: 3, bankId: 3, balance: 45900 },
  { clientId: 2, bankId: 3, balance: 19000 },
  { clientId: 4, bankId: 3, balance: 51000 },
  { clientId: 5, bankId: 1, balance: 89000 },
  { clientId: 1, bankId: 2, balance: 1600 },
  { clientId: 5, bankId: 3, balance: 37500 },
  { clientId: 6, bankId: 1, balance: 19200 },
  { clientId: 2, bankId: 3, balance: 10000 },
  { clientId: 3, bankId: 2, balance: 5400 },
  { clientId: 3, bankId: 1, balance: 9000 },
  { clientId: 4, bankId: 3, balance: 13500 },
  { clientId: 2, bankId: 1, balance: 38200 },
  { clientId: 5, bankId: 2, balance: 17000 },
  { clientId: 1, bankId: 3, balance: 1000 },
  { clientId: 5, bankId: 2, balance: 600 },
  { clientId: 6, bankId: 1, balance: 16200 },
  { clientId: 2, bankId: 2, balance: 10000 }
]

const banks = [
  { id: 1, name: 'SANTANDER' },
  { id: 2, name: 'CHILE' },
  { id: 3, name: 'ESTADO' }
];

function searchClientByID(id) {
  return clients.find(client => client.id === id);
}

function TotalBalanceByClientID(id) {

  const reducer = (acumulador, { clientId, balance }) => {
    if (clientId === id) {
      return acumulador + balance
    } else {
      return acumulador
    }
  };

  const total = accounts.reduce(reducer, 0);

  return total;
}

// 0 Arreglo con los ids de clientes
function listClientsIds() {
  return clients.map((client) => client.id);
};

// 1 Arreglo con los ids de clientes ordenados por rut
function listClientsIdsSortByTaxNumber() {
  const ruts = clients.map(client => client.taxNumber);
  return ruts.sort((a, b) => a.taxNumber - b.taxNumber);
};

// 2 Arreglo con los nombres de cliente ordenados de mayor a menor por la suma TOTAL de los saldos de cada cliente en los bancos que participa.
function sortClientsTotalBalances(logica) {
  // CODE HERE
  const list = clients.map(({ id, name }) => {

    const balance = TotalBalanceByClientID(id);

    return {
      name,
      balance
    }
  })

  let final;

  if (logica == "mayor") {
    final = list.sort((a, b) => b.balance - a.balance);
  } else {
    final = list.sort((a, b) => a.balance - b.balance);
  }

  return final;
}

// 3 Objeto en que las claves sean los nombres de los bancos y los valores un arreglo con los ruts de sus clientes ordenados alfabeticamente por nombre.
function banksClientsTaxNumbers() {
  // CODE HERE
  const obj = {};

  banks.map(({ name, id }) => {

    const clientsBank = accounts.reduce((total, { clientId, bankId }) => {
      if (bankId === id) {
        if (total.indexOf(clientId) === -1) {

          total.push(clientId);
        }
      }

      return total;
    }, []);

    const clientInfo = clientsBank.map(clientID => searchClientByID(clientID));

    const sortNames = clientInfo.sort((a, b) => {

      let fa = a.name.toLowerCase();
      let fb = b.name.toLowerCase();

      if (fa < fb) {
        return -1
      }

      if (fa > fb) {
        return 1;
      }

      return 0;
    });

    const ruts = sortNames.map(a => a.taxNumber);

    obj[name] = ruts;
  })

  return obj;
}

// 4 Arreglo ordenado decrecientemente con los saldos de clientes que tengan más de 25.000 en el Banco SANTANDER
function richClientsBalances() {
  // CODE HERE
  const bancoID = 1;
  const buscarAccountsByBank = accounts.filter(account => account.bankId === bancoID);
  const balanceSort = 25000;
  const clientsBankByBalance = buscarAccountsByBank.filter(account => account.balance >= balanceSort);
  const list = clientsBankByBalance.sort((a, b) => {

    if (a.balance < b.balance) {
      return -1;
    }

    if (a.balance > b.balance) {
      return 1;
    }

    return 0;
  })

  return list;
}

// 5 Arreglo con ids de bancos ordenados crecientemente por la cantidad TOTAL de dinero que administran.
function banksRankingByTotalBalance() {
  // CODE HERE

  const list = [];

  banks.map(({ id, name }) => {

    const reduce = (acumulador, account) => {
      if (account.bankId === id) {
        return acumulador + account.balance
      } else {
        return acumulador
      }
    }

    const balance = accounts.reduce(reduce, 0);

    list.push({
      name,
      balance
    });

  })


  const listCreciente = list.sort((a, b) => {


    if (a.balance < b.balance) {
      return -1;
    }

    if (a.balance > b.balance) {
      return 1;
    }

    return 0;
  })

  return listCreciente;

}

// 6 Objeto en que las claves sean los nombres de los bancos y los valores el número de clientes que solo tengan cuentas en ese banco.
function banksFidelity() {
  // CODE HERE

  const obj = {};

  banks.map(({ id, name }) => {

    clients.map(({ id: clientByID }) => {

      let valorInicial = 0;
      const cuentas = accounts.filter(({ clientId }) => clientId === clientByID);

      cuentas.map(({ bankId }) => {

        if (bankId === id) {
          valorInicial++;
        }

      });

      if (cuentas.length === valorInicial) {
        obj[name] = cuentas.filter(c => c.clientId);
      } else {
        obj[name] = []
      }

    })

  })

  return obj;
}

// 7 Objeto en que las claves sean los nombres de los bancos y los valores el id de su cliente con menos dinero.
function banksPoorClients() {
  // CODE HERE
  const obj = {};

  banks.map(({ id, name }) => {

    obj[name] = [];

    clients.map(({ id: clientByID, name: Person }) => {

      const cuentas = accounts.filter(({ clientId }) => clientId === clientByID);
      const reducer = (acumulador, { balance, bankId }) => {
        if (bankId === id) {
          return acumulador + balance;
        } else {
          return acumulador;
        }
      }

      const resultado = cuentas.reduce(reducer, 0);

      if (resultado !== 0) {
        obj[name].push({ clientID: clientByID });
      }

    })

    obj[name].sort((a, b) => {

      if (a.resultado < b.resultado) {
        return -1;
      }

      if (a.resultado > b.resultado) {
        return 1;
      }

      return 0;
    })

    obj[name] = obj[name][0];
  });

  return obj

}

// 8 Agregar nuevo cliente con datos ficticios a "clientes" y agregar una cuenta en el BANCO ESTADO con un saldo de 9000 para este nuevo empleado. 
// Luego devolver el lugar que ocupa este cliente en el ranking de la pregunta 2.
// No modificar arreglos originales para no alterar las respuestas anteriores al correr la solución
function newClientRanking() {
  // CODE HERE
  let clientsNew = [].concat(clients);
  clientsNew.push({ id: 7, taxNumber: "202007643", name: "Rene Alejandro" });
  let accountsNew = [].concat(accounts);
  accountsNew.push({ clientId: 7, bankId: 3, balance: 9000 });

  const totalBalanceByClientIDAndSource = (id, source = []) => {
    const reducer = (acumulador, { clientId, balance }) => {
      if (clientId === id) {
        return acumulador + balance;
      } else {
        return acumulador
      }
    }

    const total = source.reduce(reducer, 0);

    return total;
  }

  const list = clientsNew.map(({ id, name }) => {

    const balance = totalBalanceByClientIDAndSource(id, accountsNew);

    return {
      name,
      balance
    }
  });

  const ranking = list.sort((a, b) => {


    if (a.balance < b.balance) {
      return -1;
    }

    if (a.balance > b.balance) {
      return 1;
    }

    return 0;
  });

  return ranking;
}






// No modificar, eliminar o alterar cualquier línea de código o comentario de acá para abajo
// Cualquier cambio hará que su prueba quede invalidada automáticamente
console.log('Pregunta 0');
console.log(listClientsIds());
console.log('Pregunta 1');
console.log(listClientsIdsSortByTaxNumber());
console.log('Pregunta 2');
console.log(sortClientsTotalBalances("mayor"));
console.log('Pregunta 3');
console.log(banksClientsTaxNumbers());
console.log('Pregunta 4');
console.log(richClientsBalances());
console.log('Pregunta 5');
console.log(banksRankingByTotalBalance());
console.log('Pregunta 6');
console.log(banksFidelity());
console.log('Pregunta 7');
console.log(banksPoorClients());
console.log('Pregunta 8');
console.log(newClientRanking());
