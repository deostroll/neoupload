using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DeoFileUpload.Controllers
{
    public class UploadController : Controller
    {
        //
        // GET: /Upload/

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public string DoUpload(HttpPostedFileBase uploadedFile)
        {
            var fname = Guid.NewGuid().ToString();
            var extn = Path.GetExtension(uploadedFile.FileName);
            var pathToSave = Path.Combine(
                Server.MapPath("~/Files"),
                fname + extn);

            uploadedFile.SaveAs(pathToSave);
            return fname + extn;
        }

        public ActionResult NeoUpload()
        {
            return View();
        }

    }
}
