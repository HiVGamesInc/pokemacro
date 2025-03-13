import sys
import io
from PyQt5 import QtWidgets, QtCore, QtGui
from PIL import ImageGrab

class Snipper(QtWidgets.QWidget):
    def __init__(self, screenshot):
        super().__init__()
        self.screenshot = screenshot

        data = io.BytesIO()
        self.screenshot.save(data, format="PNG")
        data.seek(0)
        self.pixmap = QtGui.QPixmap()
        self.pixmap.loadFromData(data.read(), "PNG")
        
        self.setWindowTitle("Select Area")
        self.setWindowFlags(QtCore.Qt.FramelessWindowHint)
        self.showFullScreen()
        self.activateWindow()

        self.origin = None
        self.rubberBand = QtWidgets.QRubberBand(QtWidgets.QRubberBand.Rectangle, self)
        self.selected_rect = None

    def paintEvent(self, event):
        painter = QtGui.QPainter(self)
        painter.drawPixmap(0, 0, self.pixmap)

    def mousePressEvent(self, event):
        self.origin = event.pos()
        self.rubberBand.setGeometry(QtCore.QRect(self.origin, QtCore.QSize()))
        self.rubberBand.show()

    def mouseMoveEvent(self, event):
        if self.rubberBand.isVisible():
            rect = QtCore.QRect(self.origin, event.pos()).normalized()
            self.rubberBand.setGeometry(rect)

    def mouseReleaseEvent(self, event):
        self.selected_rect = self.rubberBand.geometry()
        self.rubberBand.hide()
        self.close()

def get_crop_area():
    full_screenshot = ImageGrab.grab()
    
    app = QtWidgets.QApplication(sys.argv)
    snipper = Snipper(full_screenshot)
    snipper.show()
    snipper.activateWindow()
    snipper.raise_()
    app.exec()  

    rect = snipper.selected_rect
    if rect:
        return (rect.x(), rect.y(), rect.width(), rect.height(), full_screenshot)
    else:
        raise Exception("No region selected")
