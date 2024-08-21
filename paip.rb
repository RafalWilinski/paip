class Paip < Formula
  desc "A CLI that uses an AI to retry failed pip commands based on the output"
  homepage "https://rwilinski.ai"
  version "0.0.1"

  if Hardware::CPU.arm?
    url "https://github.com/RafalWilinski/paip/releases/download/v0.0.1/paip-macos-arm64"
    sha256 "d6ccf48f34d0b19367bc4e9a2444b35cae98ab6e24a39c4375c59c628de1be99" 
  else
    url "https://github.com/RafalWilinski/paip/releases/download/v0.0.1/paip-macos-x64"
    sha256 "e1990cd9381d26e03eafb67954dca2f329a797c7b72ff153eb1ce48cb0bf7746"
  end

  def install
    bin.install "paip-macos-#{Hardware::CPU.arm? ? "arm64" : "x64"}" => "paip"
  end

  test do
    system "#{bin}/paip", "--version"
  end
end