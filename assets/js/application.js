var $uploadContainer = "allUploadTransfers";
var $downloadContainer = "allDownloadTransfers";

function toggle(showHideDiv, switchTextDiv, displayText) {
    var ele = document.getElementById(showHideDiv);
    var text = document.getElementById(switchTextDiv);
    if(ele.style.display == "block") {
            ele.style.display = "none";
        text.innerHTML = "Show " + displayText;
    }
    else {
        ele.style.display = "block";
        text.innerHTML = "Hide " + displayText;
    }
}

function consoleLog(info) {
  try {
     if(console) {
       console.log(info);
     }
  }
  catch (e) {
     //Eat the exception. Only happend on IE 9 intermittently
  }
}

function insertButton(buttonValue, className, container, onclickFunction) {
    var iButton;
    iButton = document.createElement('input');
    iButton.type = 'button';
    iButton.value = buttonValue;
    iButton.className = className;

    iButton.setAttribute('onclick', onclickFunction);
    document.getElementById(container).appendChild(iButton);
}

var addToTable = function (container, name, transferSpec, connectSettings) {
    var subcontainer = document.createElement('tr');
    subcontainer .setAttribute('style','border: gray 0px dashed; text-align:center; align:center');
    subcontainer.setAttribute('id', name);

    /********************************************************/
    var bar = document.createElement('div');
    bar.setAttribute('id','p_' + name);
    bar.setAttribute('class',"easyui-progressbar progressbar");
    bar.setAttribute('style','text-align:center; width: 100%; align:center;');

    var barTh = document.createElement('th');
    barTh.setAttribute('id','thp_' + name);
    barTh.setAttribute('class',"nobg");

    /******************************************************/
    var text = document.createElement('div');
    text.setAttribute('id','file_name_' + name);
    text.setAttribute('style','text-align: center;word-wrap: break-word;');

    var textTh = document.createElement('th');
    textTh.setAttribute('id','thfile_name_' + name);
    textTh.setAttribute('class',"nobg");


    /*****************************************************/
    var pause = document.createElement('input');
    pause.type = 'button';
    pause.setAttribute('id','pause_' + name);
    pause.setAttribute('name','Pause');
    pause.setAttribute('value','Pause');

    var remove = document.createElement('input');
    remove.type = 'button';
    remove.setAttribute('id','remove_' + name);
    remove.setAttribute('value','Remove');

    var tsjson = document.createElement('input');
    tsjson.type = 'button';
    tsjson.setAttribute('id','tsjson_' + name);
    tsjson.setAttribute('value','Show TransferSpec');

    var resjson = document.createElement('input');
    resjson.type = 'button';
    resjson.setAttribute('id','resjson_' + name);
    resjson.setAttribute('value','Show Progress JSON');

    var buttonTh = document.createElement('th');
    buttonTh.setAttribute('id','thbutton_' + name);
    buttonTh.setAttribute('class',"nobg");

    /********** update the DOM **********************/
    document.getElementById(container).appendChild(subcontainer);
    $('#'+name).append(barTh);
    $('#'+name).append(textTh);
    $('#'+name).append(buttonTh);
    $('#thp_'+name).append(bar);
    $('#thfile_name_'+name).append(text);
    $('#thbutton_'+name).append(pause);
    $('#thbutton_'+name).append(remove);
    $('#thbutton_'+name).append(resjson);
    $('#thbutton_'+name).append(tsjson);

    /****************** start hidden *****************/
    var jsonTS = document.createElement('span');
    jsonTS.setAttribute('id','json_' + name);
    jsonTS.setAttribute('style','display:none');

    var jsonResult = document.createElement('span');
    jsonResult.setAttribute('id','jresult_' + name);
    jsonResult.setAttribute('style','display:none');

    var span = document.createElement('span');
    span.setAttribute('id','span_' + name);
    span.setAttribute('style','display:none');

    $('#'+name).append(jsonTS);
    $('#'+name).append(jsonResult);
    $('#'+name).append(span);
    /****************** end hidden *****************/

    /***************** button functions ***********/
    $("#pause_"+name).click(function(e) {
        if ( $(this).val() === "Pause" ) {
          var res = xferControls.stopTransfer($('#span_'+name).text());
          if(res) {
            $( this ).val('Resume');
          }
        } else {
          var res = xferControls.resumeTransfer($('#span_'+name).text());
          if(res) {
            $( this ).val('Pause');
          }
        }
        e.preventDefault();
    });
    $("#remove_"+name).click(function(e) {
      xferControls.cancelTransfer(name, $('#span_'+name).text());
      e.preventDefault();
    });
    $("#tsjson_"+name).click(function(e) {
      if( $(this).val() === "Show TransferSpec" ) {
        xferControls.showTransferSpecJSON(name);
        $( this ).val('Hide TransferSpec');
      } else {
        xferControls.hide($('#transfer_spec'));
        $( this ).val('Show TransferSpec');
      }
      e.preventDefault();
    });
    $("#resjson_"+name).click(function(e) {
      if( $(this).val() === "Show Progress JSON" ) {
        xferControls.showResultJSON(name);
        $( this ).val('Hide Progress JSON');
      } else {
        xferControls.hide($('#progress_json'));
        $( this ).val('Show Progress JSON');
      }
      e.preventDefault();
    });

    $("#p_" + name).progressbar({'value':0});
    $("#json_" + transferSpec.cookie).text("transfer_spec " + JSON.stringify(transferSpec, null, 4) +
                                       " connect_settings " + JSON.stringify(connectSettings, null, 4));
};

getTransferEvents = function () {
    var allXfers = asperaWeb.getAllTransfers();
    if(typeof allXfers.error === 'undefined') {
      var resultcount = allXfers.result_count;
      var xfers = allXfers.transfers;
      for (var i=0; i < resultcount; i++) {
        var container;
        var toggleG;
        var download = true;
        if(xfers[i].transfer_spec.direction === "send") {
          download = false;
        }

        if(download) {
          container = $downloadContainer;
          toggleG = $('#downloads_group');
        } else {
          container = $uploadContainer;
          toggleG = $('#uploads_group');
        }
        //insert elements into table
        addToTable(container,
                       xfers[i].transfer_spec.cookie,
                       xfers[i].transfer_spec,
                       xfers[i].aspera_connect_settings);
        toggleG.show();
        if(xfers[i].status === "cancelled") {
          $("#pause_"+xfers[i].transfer_spec.cookie).val('Resume');
        } else if (xfers[i].status === "completed") {
          $("#pause_"+xfers[i].transfer_spec.cookie).hide();
        }
      }
    }
};

var setup  = function () {
    this.asperaWeb = new AW.Connect({id:'aspera_web_transfers'});

    $("#upload_files_button").click(function(e) {
      asperaWeb.showSelectFileDialog({success:fileControls.uploadFiles},
            options = {
             allowMultipleSelection : true
            });
      e.preventDefault();
    });

    $("#upload_directory_button").click(function(e) {
      asperaWeb.showSelectFolderDialog({success:fileControls.uploadFiles},
            options = {
             allowMultipleSelection : true
            });
      e.preventDefault();
    });

    $("#download_files_button").click(function(e) {
      fileControls.selectFolder("collections");
      e.preventDefault();
    });

    this.asperaWeb.initSession("SimpleCombined");
    this.asperaWeb.addEventListener('transfer', fileControls.handleTransferEvents);

    //to start, get all transfers and display them
    getTransferEvents();
};

fileControls = {};

fileControls.handleTransferEvents = function (event, obj) {
    switch (event) {
        case 'transfer':
          var jsonObj = eval(obj);
          consoleLog(JSON.stringify(obj, null, "        "));

          var cookie = jsonObj.transfer_spec.cookie;
          $('#p_'+cookie).progressbar('setValue', Math.floor(obj.percentage * 100));

          var info = obj.current_file;
          if(obj.status === "failed") {
            info = obj.title + ": " + obj.error_desc;
          } else if(obj.status === "completed") {
            $("#pause_"+cookie).hide();
            info = obj.title;
          }
          $("#file_name_"+cookie).text(obj.transfer_spec.direction + " - " + info);

          $("#jresult_"+cookie).text(JSON.stringify(obj, null, 4));
          $('#span_'+cookie).text(obj.transfer_spec.tags.aspera.xfer_id);
          break;
    }
};

fileControls.transfer = function(transferSpec, connectSettings) {
    asperaWeb.startTransfer(transferSpec, connectSettings,
                          callbacks = {
                            error : function(obj) {
                              consoleLog("Failed to start : " + JSON.stringify(obj, null, 4));
                            },
                            success:function () {
                              var container;
                              var toggleG;
                              var download = true;
                              if(transferSpec.direction === "send") {
                                download = false;
                              }

                              if(download) {
                                container = $downloadContainer;
                                toggleG = $('#downloads_group');
                              } else {
                                container = $uploadContainer;
                                toggleG = $('#uploads_group');
                              }
                              //insert elements into table
                              addToTable(container, transferSpec.cookie, transferSpec, connectSettings);
                              toggleG.show();
                              consoleLog("Started transfer : " + JSON.stringify(transferSpec, null, 4));
                            }
                           });
};

fileControls.uploadFiles = function (pathArray) {
    var username = $("#username").val();
    var userpassword = $("#userpassword").val();
    transferSpec = {
      "paths": [],
      "remote_host": "dtn2.rdsi-test.intersect.org.au",
      "remote_user": username,
      "remote_password": userpassword,
      "ssh_port" : 33001,
      "fasp_port" : 33001,
      "direction": "send",
      "rate_policy": "high",
      "target_rate_kbps" : 5000,
      "resume" : "sparse_checksum",
      "destination_root": "collections",
      "cookie" : "u-"+new Date().getTime()
    };

    for (var i = 0, length = pathArray.length; i < length; i +=1) {
        transferSpec.paths.push({"source":pathArray[i]});
    }

    if (transferSpec.paths.length === 0) {
      return;
    }

    connectSettings = {
        "allow_dialogs": "no"
    };

    fileControls.transfer(transferSpec, connectSettings);
};

fileControls.downloadFiles = function (sourcePath, destinationPath) {
    var username = $("#username").val();
    var userpassword = $("#userpassword").val();
    transferSpec = {
        "paths": [],
        "remote_host": "dtn2.rdsi-test.intersect.org.au",
        "remote_user": username,
        "remote_password": userpassword,
        "ssh_port": 33001,
        "fasp_port": 33001,
        "direction": "receive",
        "rate_policy": "fair",
        "target_rate" : 5000,
        "allow_dialogs" : true,
        "cookie" : "d-"+new Date().getTime(),
        "destination_root": destinationPath
    };

    var path;
    path = {"source":sourcePath};
    transferSpec.paths.push(path);

    connectSettings = {
        "allow_dialogs": false,
        "use_absolute_destination_path": true
    };

    fileControls.transfer(transferSpec, connectSettings);
};

/**
 * Open a file selection dialog to choose the destination folder for download
 */
fileControls.selectFolder = function (sourcePath) {
    asperaWeb.showSelectFolderDialog(
       callbacks = {
              error : function(obj) {
                consoleLog("Destination folder selection cancelled. Download cancelled.");
              },
              success:function (pathArray) {
                var destPath = null;
                if (!(pathArray == null || typeof pathArray === "undefined" || pathArray.length === 0)) {
                  destPath = pathArray[0];
                  consoleLog("Destination folder for download: " + destPath);
                    fileControls.downloadFiles(sourcePath, destPath);
                }
              }
       },
      //disable the multiple selection.
      options = {
        allowMultipleSelection : false,
        title : "Select Destination Folder"
      });
};

xferControls = {};

xferControls.stopTransfer = function (transferId) {
    if(!(typeof transferId === 'undefined' || transferId == null)) {
      var result = asperaWeb.stopTransfer(transferId);
      consoleLog("Paused transfer id : " + transferId + " " + JSON.stringify(result, null, 4));
      return (result == null || typeof result.error === 'undefined' || result.error === null );
    }
    return false;
};

xferControls.resumeTransfer = function (transferId) {
    if(!(typeof transferId === 'undefined' || transferId == null)) {
      var result = asperaWeb.resumeTransfer(transferId);
      consoleLog("Resume transfer id : " + transferId + " " + JSON.stringify(result, null, 4));
      return (typeof result.error === 'undefined' || result.error === null );
    }
    return false;
};

xferControls.cancelTransfer = function (cookie, transferId) {
    if(!(typeof transferId === 'undefined' || transferId == null)) {
      var result = asperaWeb.removeTransfer(transferId);
      $("#"+cookie).remove();
      consoleLog("Removed transfer id : " + transferId + " " + JSON.stringify(result, null, 4));
    }
};

xferControls.showResultJSON = function (cookie) {
    document.getElementById('progress_json').innerHTML = $("#jresult_"+cookie).text();
    $('#progress_json').show();
};

xferControls.showTransferSpecJSON = function (cookie) {
    document.getElementById('transfer_spec').innerHTML = $("#json_" + cookie).text();
    $('#transfer_spec').show();
};

xferControls.hide = function (element) {
    element.hide();
};
