class Paip < Formula
  desc "A CLI that uses an AI to retry failed pip commands based on the output"
  homepage "https://rwilinski.ai"
  version "0.0.3"

  if Hardware::CPU.arm?
    url "https://github.com/RafalWilinski/paip/releases/download/v0.0.1/paip-macos-arm64"
    sha256 "953da836c8e9c05e1923828f029c5d0c3bb01f0430384d64fdb8b2f8f040a9b2"
  else
    url "https://github.com/RafalWilinski/paip/releases/download/v0.0.1/paip-macos-x64"
    sha256 "c9afe24f5dcebb6a1ccf6fd8cb80cb09eb97c56353b99e817c327c9ad4b1565f"
  end

  def install
    bin.install "paip-macos-#{Hardware::CPU.arm? ? "arm64" : "x64"}" => "paip"
  end

  test do
    system "#{bin}/paip", "--version"
  end
end
