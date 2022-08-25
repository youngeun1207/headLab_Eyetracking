function inputID() {
    swal({
        title: "ID를 입력해주세요.",
        content: "input",
        buttons: {
            confirm: true
        }
      })
      .then((value) => {
        userID = value;
        startWebgaze();
        Restart();
      });
}