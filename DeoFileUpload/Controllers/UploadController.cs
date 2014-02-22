using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
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

        public ActionResult NewUploadMultiple()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Save(string file1, string file2, string file3)
        {
            ContentResult result = new ContentResult();
            result.ContentType = "text/html";
            StringBuilder sb = new StringBuilder();
            sb.Append("<html><body>");
            sb.Append(string.Format("<p>{0}</p>", file1));
            sb.Append(string.Format("<p>{0}</p>", file2));
            sb.AppendFormat("<p>{0}</p>", file3);
            sb.Append("</body></html>");
            result.Content = sb.ToString();
            return result;
        }

    }
}
