if (jQuery !== undefined) {
    (function ($) {
        $.fn.makeUpload = function (options) {

            var uploadForms = [];
            var defaults = {
                autoUpload: true,
                onUploadComplete: function (data) {
                    //empty function
                    console.log('upload completed with data:', data);
                },
                onChange: function (filename) {
                    console.log('uploaded file name:', filename);
                },
                keyName: 'uploadedFile',
                url: null,
                submitButton: null,
                onAllUploadDone: function () {
                    console.log('submit complete');
                }
            };

            var config = $.extend(defaults, options);

            if (config.submitButton != null) {
                $(config.submitButton).click(function (e) {
                    var i = 0;
                    var total = uploadForms.length;
                    function next() {
                        if (i < total) {                            
                            var o = uploadForms[i];
                            i++;
                            if (o.hasValue)
                                o.form.submit();
                            else
                                next();
                        }
                        else {
                            if (typeof (config.onAllUploadDone) === 'function') {
                                config.onAllUploadDone();
                            }
                        }
                    }
                    $.each(uploadForms, function (i, obj) {
                        $(obj.control).bind('load', function () {
                            next();
                        });
                    });

                    //start the upload
                    next();
                });
            }
            return this.each(function (idx, el) {

                //1. Create an iframe and add it to the DOM
                var ifr = document.createElement('iframe');
                var $ifr = $(ifr).hide();
                $ifr.attr('id', 'neoUpload' + idx);

                //2. stuff necessary for upload
                var form = document.createElement('form');
                form.setAttribute('enctype', 'multipart/form-data');
                form.setAttribute('method', 'post');
                if (config.url == null) throw "url parameter was not specified";
                form.setAttribute('action', config.url);

                var finput = document.createElement('input');
                finput.type = 'file';
                finput.name = config.keyName;

                form.appendChild(finput);
                uploadForms.push({ form: form, hasValue: false, control: ifr });

                //3. wiring iframe for initial loading...and adding to DOM
                $ifr.load({ form: form, source: el }, ifrInit);
                $(document.body).append($ifr);

                //4 associating events

                //4.1 subscribing change event
                $(finput).change({ form: form, source: el }, function (e) {

                    if (typeof (config.onChange) === 'function')
                        config.onChange.apply(el, [finput.value]);

                    if (config.autoUpload) {
                        form.submit();
                    }
                    else {
                        var arr = $.grep(uploadForms, function (f) { return f.form === e.data.form });
                        arr[0].hasValue = true;
                    }
                });

                //4.2 for the associated control
                $(el).click(function (e) {
                    $(finput).trigger('click');
                    e.preventDefault();
                });

                //To initialize the iframe
                function ifrInit(e) {
                    var doc = this.contentWindow.document.body;
                    $(doc).append(e.data.form);
                    $(this).unbind('load', ifrInit);
                    $(this).bind('load', e.data, processUpload);
                }

                //to process post file upload
                function processUpload(e) {

                    var ifrDoc = this.contentWindow.document;
                    if (typeof (config.onUploadComplete) === 'function')
                        config.onUploadComplete.call(e.data.source, $(ifrDoc).text());
                    //var body = ifrDoc.body;
                    //$(body).empty().append(e.data.form);
                }

            });
        };
    })(jQuery);
}
