#! /bin/sh

if [ -e ./wetAPP.wgt ]; then 
    rm -v wetAPP.wgt
fi

# Zip all the html, javascript, CSS, images and other information.
zip -r wetAPP.wgt *.html ./js/*.js ./css/* ./fonts/* ./img/* ./webinossocket.js config.xml tweeting.png -x *~ -x */*~


